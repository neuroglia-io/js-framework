import { Injectable, Injector, inject } from '@angular/core';
import {
  ColumnDefinition,
  IQueryableTableStore,
  QueryableTableState,
  QueryableTableStore,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import {
  GRAPHQL_DATA_SOURCE_ENDPOINT,
  GRAPHQL_DATA_SOURCE_TARGET,
  GraphQLDataSource,
} from 'projects/neuroglia/angular-data-source-graphql/src/public-api';
import { GraphQLMetadataService } from './graphql-metadata.service';
import { Observable, filter, map, of, switchMap, takeUntil } from 'rxjs';
import { isSet } from '@neuroglia/common';
import { QueryableTableConfig } from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { GraphQLSchema } from 'graphql';

@Injectable()
export class GraphQLTableStore<
    TState extends QueryableTableState<TData> = QueryableTableState<any>,
    TData = any,
    TConfig extends QueryableTableConfig = QueryableTableConfig,
  >
  extends QueryableTableStore<TState, TData>
  implements IQueryableTableStore<TState, TData>
{
  /** Holds the datasource instance */
  protected dataSource: GraphQLDataSource<TData> | null;

  /** The @see {@link GraphQLMetadataService} */
  protected graphQLMetadataService = inject(GraphQLMetadataService);

  constructor() {
    super();
  }

  /** @inheritdoc */
  protected getServiceDataEnpoint(config: TConfig): string {
    if (!isSet(config.serviceUrl)) {
      throw new Error('Missing GraphQL service URL.');
    }
    return config.serviceUrl;
  }

  /** @inheritdoc */
  protected getColumnDefinitions(config: TConfig): Observable<ColumnDefinition[]> {
    return !config.useMetadata
      ? of(config.columnDefinitions).pipe(
          filter((definitions: ColumnDefinition[] | undefined) => !!definitions?.length),
          map((definitions: ColumnDefinition[] | undefined) => definitions as ColumnDefinition[]),
        )
      : this.graphQLMetadataService.getMetadataFromIntrospection(config.serviceUrl!).pipe(
          takeUntil(this.destroy$),
          switchMap((_: GraphQLSchema) =>
            this.graphQLMetadataService.getColumnDefinitions(config.targetType || config.target!),
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
    return 'String';
  }

  /** @inheritdoc */
  protected injectDataSource(config: TConfig): Observable<GraphQLDataSource<TData>> {
    const dataUrl = this.get((state) => state.dataUrl);
    const target = this.get((state) => state.target);
    const dataSourceInjector = Injector.create({
      name: 'DataSourceInjector',
      parent: this.injector,
      providers: [
        GraphQLDataSource,
        { provide: GRAPHQL_DATA_SOURCE_ENDPOINT, useValue: dataUrl },
        { provide: GRAPHQL_DATA_SOURCE_TARGET, useValue: target },
      ],
    });
    return dataSourceInjector.get(GraphQLDataSource) as GraphQLDataSource<TData>;
  }
}
