import { Injectable, Injector, inject } from '@angular/core';
import { ODATA_DATA_SOURCE_ENDPOINT, ODataDataSource } from '@neuroglia/angular-data-source-odata';
import {
  ColumnDefinition,
  IQueryableTableStore,
  QueryableTableState,
  QueryableTableStore,
  QueryableTableConfig,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ODataPrimitiveTypeEnum } from './models';
import * as ODataMetadataSchema from './models/odata-metadata';
import { ODataMetadataService } from './odata-metadata.service';

@Injectable()
export class ODataTableStore<
    TState extends QueryableTableState<TData> = QueryableTableState<any>,
    TData = any,
    TConfig extends QueryableTableConfig = QueryableTableConfig,
  >
  extends QueryableTableStore<TState, TData>
  implements IQueryableTableStore<TState, TData>
{
  /** Holds the datasource instance */
  protected dataSource: ODataDataSource<TData> | null;

  /** The @see {@link ODataMetadataService} */
  protected odataMetadataService = inject(ODataMetadataService);

  constructor() {
    super();
  }

  /** @inheritdoc */
  protected getServiceDataEnpoint(config: TConfig): string {
    return (
      config.dataUrl ||
      `${config.serviceUrl}${!config.serviceUrl!.endsWith('/') ? '/' : ''}${config.target}${config.query || ''}`
    );
  }

  /** @inheritdoc */
  protected getColumnDefinitions(config: TConfig): Observable<ColumnDefinition[]> {
    return !config.useMetadata
      ? of(config.columnDefinitions).pipe(
          filter((definitions: ColumnDefinition[] | undefined) => !!definitions?.length),
          map((definitions: ColumnDefinition[] | undefined) => definitions as ColumnDefinition[]),
        )
      : this.odataMetadataService.getMetadata(config.serviceUrl!).pipe(
          takeUntil(this.destroy$),
          switchMap((_: ODataMetadataSchema.Metadata) =>
            !config.targetType
              ? this.odataMetadataService.getColumnDefinitions(config.target!)
              : this.odataMetadataService.getColumnDefinitionsForQualifiedName(config.targetType),
          ),
          map((definitions: ColumnDefinition[]) => {
            const stateDefinitionNames = (config.columnDefinitions || []).map((def) => def.name);
            const columnDefinitions = [
              ...definitions.filter((def) => !stateDefinitionNames.includes(def.name)),
              ...(config.columnDefinitions || []).map((stateDef) => {
                const def = definitions.find((def) => def.name === stateDef.name);
                if (!def) {
                  return stateDef;
                }
                const columnDefinition = { ...def, ...stateDef };
                return columnDefinition;
              }),
            ];
            return columnDefinitions as ColumnDefinition[];
          }),
        );
  }

  /** @inheritdoc */
  protected getStringType(): string {
    return ODataPrimitiveTypeEnum.String;
  }

  /** @inheritdoc */
  protected injectDataSource(config: TConfig): Observable<ODataDataSource<TData>> {
    const dataUrl = this.get((state) => state.dataUrl);
    const dataSourceInjector = Injector.create({
      name: 'DataSourceInjector',
      parent: this.injector,
      providers: [ODataDataSource, { provide: ODATA_DATA_SOURCE_ENDPOINT, useValue: dataUrl }],
    });
    return of(dataSourceInjector.get(ODataDataSource) as ODataDataSource<TData>);
  }
}
