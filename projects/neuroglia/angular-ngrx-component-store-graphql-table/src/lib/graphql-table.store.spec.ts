import { combineLatest, from, skip, take } from 'rxjs';
import { GraphQLTableStore } from './graphql-table.store';
import { GraphQLTableConfig } from './models';
import { GraphQLSchema, IntrospectionQuery, buildClientSchema, getIntrospectionQuery } from 'graphql';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, UrlHelperService } from '@neuroglia/angular-rest-core';
import { KeycloakService } from 'keycloak-angular';
import { get } from '@neuroglia/common';
import {
  GRAPHQL_DATA_SOURCE_VARIABLES_MAPPER,
  GraphQLQueryArguments,
  GraphQLVariablesMapper,
} from '@neuroglia/angular-data-source-graphql';
import { CombinedParams } from '@neuroglia/angular-data-source-queryable';

const testEndpoint = 'https://swapi-graphql.netlify.app/.netlify/functions/index';

const config: GraphQLTableConfig = {
  dataSourceType: 'graphql',
  serviceUrl: testEndpoint,
  target: 'allPlanets',
  targetSubField: 'planets',
  countSubField: 'data.allPlanets.totalCount', //for OData like responses: [ 'data', '@odata.count' ]
  dataSubField: 'data.allPlanets.planets',
  useMetadata: true,
  columnDefinitions: [],
};

const expectedPlanetFields = [
  'name',
  'climates',
  'created',
  'diameter',
  'edited',
  'gravity',
  'id',
  'orbitalPeriod',
  'population',
  'rotationPeriod',
  'surfaceWater',
  'terrains',
];

const getPlanetsQuery = `query GetPlanets($first: Int, $last: Int, $after: String, $before: String) {
  allPlanets(first: $first, last: $last, after: $after, before: $before) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    planets {
      name
      id
      climates
      created
      diameter
      edited
      gravity
      orbitalPeriod
      population
      rotationPeriod
      surfaceWater
      terrains
    }
    totalCount
    edges {
      cursor
      node {
        climates
        created
        diameter
        edited
        gravity
        id
        name
        population
        orbitalPeriod
        rotationPeriod
        surfaceWater
        terrains
      }
    }
  }
}`;

const countSelector = (graphqlResponse: any): number => get(graphqlResponse, config.countSubField!) || 0;

const dataSelector = (graphqlResponse: any): any[] => get(graphqlResponse, config.dataSubField!) || [];

const variablesMapper: GraphQLVariablesMapper = (
  args: GraphQLQueryArguments | null,
  combinedParams: CombinedParams<any>,
): GraphQLQueryArguments => {
  const [_, __, pagingParam] = combinedParams;
  const variables: any = {};
  if (pagingParam?.top) {
    variables.first = pagingParam.top;
    if (pagingParam.skip) {
      variables.after = btoa(`arrayconnection:${pagingParam.skip - 1}`);
    }
  }
  return variables;
};

describe('GraphQL Table Store', () => {
  let store: GraphQLTableStore;
  let expectedMetadata: GraphQLSchema;
  let expectedPlanetResponse: any;

  beforeAll((done) => {
    const query = getIntrospectionQuery();
    combineLatest([
      from(
        fetch(testEndpoint, {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ query }),
        }).then((res) => res.json()),
      ),
      from(
        fetch(testEndpoint, {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ query: getPlanetsQuery }),
        }).then((res) => res.json()),
      ),
    ])
      .pipe(take(1))
      .subscribe({
        next: ([introspection, planetsResponse]: [{ data: IntrospectionQuery }, any]) => {
          expectedMetadata = buildClientSchema(introspection.data);
          expectedPlanetResponse = planetsResponse;
          done();
        },
      });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        NamedLoggingServiceFactory,
        HttpErrorObserverService,
        UrlHelperService,
        KeycloakService,
        GraphQLTableStore,
        { provide: GRAPHQL_DATA_SOURCE_VARIABLES_MAPPER, useValue: variablesMapper },
      ],
    });
    store = TestBed.inject(GraphQLTableStore);
  });

  afterEach(() => {
    store.clear();
    store.destroy();
  });

  describe('init', () => {
    it('should init', (done) => {
      store.init(config).subscribe({
        next: (state) => {
          expect(state.dataUrl).toBe(config.serviceUrl);
          expect(state.columnDefinitions.length).toBe(expectedPlanetFields.length);
          done();
        },
        error: (err) => {
          expect(err).withContext('error').toBeNull();
          done();
        },
      });
    });
  });

  describe('data$', () => {
    it('should emit data', (done) => {
      const expectedValues = dataSelector(expectedPlanetResponse).slice(0, 20);
      combineLatest([
        store.data$.pipe(skip(1)), // emits empty array first, before the 1st request
        store.init(config),
      ]).subscribe({
        next: ([data, state]) => {
          expect(data.length).toBe(expectedValues.length);
          expect(data).toEqual(expectedValues);
          done();
        },
        error: (err) => {
          expect(err).withContext('error').toBeNull();
          done();
        },
      });
    });
  });

  describe('count$', () => {
    it('should emit count', (done) => {
      const expectedValues = countSelector(expectedPlanetResponse);
      combineLatest([
        store.count$.pipe(skip(1)), // emits empty array first, before the 1st request
        store.init(config),
      ]).subscribe({
        next: ([count, state]) => {
          expect(count).toBe(expectedValues);
          done();
        },
        error: (err) => {
          expect(err).withContext('error').toBeNull();
          done();
        },
      });
    });
  });
});
