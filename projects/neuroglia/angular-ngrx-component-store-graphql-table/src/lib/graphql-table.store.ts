import { Injectable, Injector, inject } from '@angular/core';
import {
  ColumnDefinition,
  IQueryableTableStore,
  QueryableTableState,
  QueryableTableStore,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { GraphQLMetadataService } from './graphql-metadata.service';
import { Observable, combineLatest, filter, map, of, switchMap, take, takeUntil } from 'rxjs';
import { get, isSet } from '@neuroglia/common';
import { GraphQLSchema } from 'graphql';
import { GraphQLTableConfig } from './models/graphql-table-config';
import {
  CombinedParams,
  QUERYABLE_DATA_SOURCE_COUNT_SELECTOR,
  QUERYABLE_DATA_SOURCE_DATA_SELECTOR,
} from '@neuroglia/angular-data-source-queryable';
import {
  GRAPHQL_DATA_SOURCE_ENDPOINT,
  GRAPHQL_DATA_SOURCE_FIELDS,
  GRAPHQL_DATA_SOURCE_QUERY_BUILDER,
  GRAPHQL_DATA_SOURCE_TARGET,
  GraphQLDataSource,
  GraphQLQueryArguments,
  GraphQLQueryBuilder,
  GraphQLVariablesMapper,
} from '@neuroglia/angular-data-source-graphql';

@Injectable()
export class GraphQLTableStore<
    TState extends QueryableTableState<TData> = QueryableTableState<any>,
    TData = any,
    TConfig extends GraphQLTableConfig = GraphQLTableConfig,
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
  init(config: TConfig): Observable<TState> {
    if (!config.dataSubField) {
      config.dataSubField = 'data';
    }
    if (!config.countSubField) {
      config.dataSubField = ['data', '@odata.count'];
    }
    return super.init(config);
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
            config.targetType
              ? this.graphQLMetadataService.getTypeColumnDefinitions(config.targetType)
              : this.graphQLMetadataService.getQueryColumnDefinitions(config.target, config.targetSubField || ''),
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
    const dataSelector = (graphqlResponse: any): any[] => {
      return get(graphqlResponse, config.dataSubField!) as any[];
    };
    const countSelector = (graphqlResponse: any): number => {
      const count = get(graphqlResponse, config.countSubField!) as number;
      return count;
    };
    const queryBuilder: GraphQLQueryBuilder = (
      target: string,
      args: GraphQLQueryArguments | null,
      fields: string[],
      combinedParams: CombinedParams<any>,
      variablesMapper: GraphQLVariablesMapper | null,
    ): Observable<string> => {
      const operationName = 'GraphQLTableStore';
      const [selectParam, expandParam, pagingParam, orderByParam, searchParam, transformParam, filterParam] =
        combinedParams;
      const select = selectParam?.select;
      const expand = expandParam?.expand;
      let selectAndExpand: string[] = [];
      if (select) {
        if (!Array.isArray(select)) {
          selectAndExpand.push(select as string);
        } else if (select.length) {
          selectAndExpand = [...selectAndExpand, ...(select as string[])];
        }
      }
      if (expand) {
        if (!Array.isArray(expand)) {
          selectAndExpand.push(expand as string);
        } else if (expand.length) {
          selectAndExpand = [...selectAndExpand, ...(expand as string[])];
        }
      }
      const processedFields = (!selectAndExpand.length ? fields : selectAndExpand).join('\n');
      const options = Object.fromEntries(
        combinedParams
          .flatMap((param) => (param ? Object.entries(param) : []))
          .filter(([key, value]) => key != 'select' && (!Array.isArray(value) ? value != null : !!value?.length)),
      );
      const variables = variablesMapper ? variablesMapper(args, combinedParams) : { options };
      return combineLatest([
        this.graphQLMetadataService.getOperationArgsBody(config.target),
        this.graphQLMetadataService.getQueryArgsBody(config.target),
      ]).pipe(
        take(1),
        map(([operationArgs, targetArgs]) => {
          const query = `query ${operationName} ${operationArgs} {
            ${target} ${targetArgs} {
              ${processedFields}
            }
          }`;
          return JSON.stringify({ operationName, query, variables });
        }),
      );
    };
    return (
      config.targetType
        ? this.graphQLMetadataService.getTypeFieldsBody(config.targetType, config.queryBodyMaxDepth || 5)
        : this.graphQLMetadataService.getQueryFieldsBody(config.target, '', config.queryBodyMaxDepth || 5)
    ).pipe(
      map((defaultFields) => {
        const dataSourceInjector = Injector.create({
          name: 'DataSourceInjector',
          parent: this.injector,
          providers: [
            GraphQLDataSource,
            { provide: QUERYABLE_DATA_SOURCE_COUNT_SELECTOR, useValue: countSelector },
            { provide: QUERYABLE_DATA_SOURCE_DATA_SELECTOR, useValue: dataSelector },
            { provide: GRAPHQL_DATA_SOURCE_ENDPOINT, useValue: dataUrl },
            { provide: GRAPHQL_DATA_SOURCE_TARGET, useValue: target },
            { provide: GRAPHQL_DATA_SOURCE_FIELDS, useValue: [defaultFields] },
            { provide: GRAPHQL_DATA_SOURCE_QUERY_BUILDER, useValue: queryBuilder },
          ],
        });
        return dataSourceInjector.get(GraphQLDataSource) as GraphQLDataSource<TData>;
      }),
    );
  }
}
