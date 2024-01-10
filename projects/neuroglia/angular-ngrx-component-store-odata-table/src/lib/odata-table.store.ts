import { Injectable, Injector, inject } from '@angular/core';
import { ODATA_DATA_SOURCE_ENDPOINT, ODataDataSource } from '@neuroglia/angular-data-source-odata';
import {
  ColumnDefinition,
  QueryableTableState,
  QueryableTableStore,
  createEmptyQueryableTableState,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { validateAuthorizations } from '@neuroglia/authorization-rule';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ODataPrimitiveTypeEnum, ODataTableState } from './models';
import * as ODataMetadataSchema from './models/odata-metadata';
import { ODataMetadataService } from './odata-metadata.service';

/** Creates a default empty state */
export function createEmptyODataTableState<T>(): ODataTableState<T> {
  return {
    ...createEmptyQueryableTableState<T>(),
    metadata: null,
  };
}

@Injectable()
export class ODataTableStore<
  TState extends ODataTableState<TData> = ODataTableState<any>,
  TData = any,
> extends QueryableTableStore<TState, TData> {
  /** Holds the datasource instance */
  protected dataSource: ODataDataSource<TData> | null;

  /** The @see {@link ODataMetadataService} */
  protected odataMetadataService = inject(ODataMetadataService);

  constructor() {
    super();
    const defaultState = createEmptyODataTableState<TData>();
    this.setState(defaultState as TState);
  }

  /** @inheritdoc */
  protected getServiceEndpoint(initialState: Partial<TState>): string {
    return (
      initialState.dataUrl ||
      `${initialState.serviceUrl}${!initialState.serviceUrl!.endsWith('/') ? '/' : ''}${initialState.target}${
        initialState.query || ''
      }`
    );
  }

  /** @inheritdoc */
  protected getColumnDefinitions(initialState: Partial<TState>): Observable<ColumnDefinition[]> {
    return !initialState.useMetadata
      ? of(initialState.columnDefinitions).pipe(
          filter((definitions: ColumnDefinition[] | undefined) => !!definitions?.length),
          map((definitions: ColumnDefinition[] | undefined) => definitions as ColumnDefinition[]),
        )
      : this.odataMetadataService.getMetadata(initialState.serviceUrl!).pipe(
          takeUntil(this.destroy$),
          switchMap((_: ODataMetadataSchema.Metadata) =>
            !initialState.targetType
              ? this.odataMetadataService.getColumnDefinitions(initialState.target!)
              : this.odataMetadataService.getColumnDefinitionsForQualifiedName(initialState.targetType),
          ),
          map((definitions: ColumnDefinition[]) => {
            const token = this.keycloak?.getKeycloakInstance()?.tokenParsed;
            const stateDefinitionNames = (initialState.columnDefinitions || []).map((def) => def.name);
            const columnDefinitions = [
              ...definitions.filter((def) => !stateDefinitionNames.includes(def.name)),
              ...(initialState.columnDefinitions || []).map((stateDef) => {
                const def = definitions.find((def) => def.name === stateDef.name);
                if (!def) {
                  return stateDef;
                }
                const columnDefinition = { ...def, ...stateDef };
                return columnDefinition;
              }),
            ].filter((def) => !def.authorizations || (token && validateAuthorizations(token, def.authorizations)));
            return columnDefinitions as ColumnDefinition[];
          }),
        );
  }

  /** @inheritdoc */
  protected getStringType(): string {
    return ODataPrimitiveTypeEnum.String;
  }

  /** @inheritdoc */
  protected injectDataSource(): ODataDataSource<TData> {
    const dataUrl = this.get((state) => state.dataUrl);
    const dataSourceInjector = Injector.create({
      name: 'DataSourceInjector',
      parent: this.injector,
      providers: [ODataDataSource, { provide: ODATA_DATA_SOURCE_ENDPOINT, useValue: dataUrl }],
    });
    return dataSourceInjector.get(ODataDataSource) as ODataDataSource<TData>;
  }
}
