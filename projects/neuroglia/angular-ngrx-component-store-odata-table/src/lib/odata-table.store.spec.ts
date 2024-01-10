import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, ODataQueryResultDto, UrlHelperService } from '@neuroglia/angular-rest-core';
import { ODataTableStore } from './odata-table.store';
import { Metadata } from './models';
import { KeycloakService } from 'keycloak-angular';
import { combineLatest, filter, from, skip, switchMap, take, tap, timer } from 'rxjs';
import { QueryableTableConfig } from '@neuroglia/angular-ngrx-component-store-queryable-table';

const testEndpoint = 'https://services.radzen.com/odata/Northwind/';

const config: QueryableTableConfig = {
  dataSourceType: 'odata',
  serviceUrl: testEndpoint,
  target: 'NorthwindProducts',
  useMetadata: true,
  columnDefinitions: [],
};

describe('OData Table Store', () => {
  let store: ODataTableStore;
  let expectedMetadata: Metadata;
  let expectedProductsResponse: ODataQueryResultDto<unknown>;
  let expectedProductsWithSuppliersResponse: ODataQueryResultDto<unknown>;

  beforeAll((done) => {
    combineLatest([
      from(fetch(testEndpoint + '$metadata?$format=json').then((res) => res.json())),
      from(fetch(testEndpoint + config.target + '?$count=true').then((res) => res.json())),
      from(fetch(testEndpoint + config.target + '?$count=true&expand=Supplier').then((res) => res.json())),
    ]).subscribe({
      next: ([metadata, products, productsWithSuppliers]) => {
        expectedMetadata = metadata;
        expectedProductsResponse = products;
        expectedProductsWithSuppliersResponse = productsWithSuppliers;
        done();
      },
      error: (err) => {
        throw err;
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
        ODataTableStore,
      ],
    });
    store = TestBed.inject(ODataTableStore);
  });

  afterEach(() => {
    store.clear();
    store.destroy();
  });

  describe('init', () => {
    it('should init', (done) => {
      const expectedProperties = [
        //...Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].BaseType),
        ...Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct),
      ]
        .filter(([key]) => !key.startsWith('$'))
        .map(([key]) => key);
      store.init(config).subscribe({
        next: (state) => {
          expect(state.dataUrl).toBe(config.serviceUrl + config.target);
          expect(state.columnDefinitions.length).toBe(expectedProperties.length);
          done();
        },
        error: (err) => {
          expect(err).withContext('error').toBeNull();
          done();
        },
      });
    });
    it('should init with expand', (done) => {
      const expectedValues = expectedProductsWithSuppliersResponse.value.slice(0, 20);
      combineLatest([
        store.data$.pipe(skip(1)), // emits empty array first, before the 1st request
        store.init({
          ...config,
          expand: ['Supplier'],
        }),
      ]).subscribe({
        next: ([data, state]) => {
          expect(state.dataUrl).toBe(config.serviceUrl + config.target);
          expect(data.length).toBe(expectedValues.length);
          expect(data).toEqual(expectedValues);
          done();
        },
        error: (err) => {
          expect(err).withContext('error').toBeNull();
          done();
        },
      });
    }),
      it('should init with select', (done) => {
        const expectedValues = expectedProductsResponse.value
          .map((value: any) => ({ ProductName: value.ProductName }))
          .slice(0, 20);
        combineLatest([
          store.data$.pipe(skip(1)), // emits empty array first, before the 1st request
          store.init({
            ...config,
            select: ['ProductName'],
          }),
        ]).subscribe({
          next: ([data, state]) => {
            expect(state.dataUrl).toBe(config.serviceUrl + config.target);
            expect(data.length).toBe(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
      }),
      it('should fail for unknown entity', (done) => {
        store
          .init({
            ...config,
            target: 'foobar',
          })
          .subscribe({
            next: (state) => {
              expect(state).toBeNull();
              done();
            },
            error: (err) => {
              expect(err.message).toBe("Enable to find a metadata container for 'foobar'.");
              done();
            },
          });
      });
  });

  describe('data$', () => {
    it('should emit data', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(0, 20);
      combineLatest([
        store.data$.pipe(skip(1)), // emits empty array first, before the 1st request
        store.init(config),
      ]).subscribe({
        next: ([data, state]) => {
          expect(state.dataUrl).toBe(config.serviceUrl + config.target);
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

  describe('sort', () => {
    it('should emit data ordered by ProductName', (done) => {
      const expectedValues = expectedProductsResponse.value
        .toSorted((a: any, b: any) => a.ProductName.localeCompare(b.ProductName))
        .slice(0, 20);
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.sort({ column: 'ProductName', direction: 'asc' });
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit data ordered by ProductName descending', (done) => {
      const expectedValues = expectedProductsResponse.value
        .toSorted((a: any, b: any) => b.ProductName.localeCompare(a.ProductName))
        .slice(0, 20);
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.sort({ column: 'ProductName', direction: 'desc' });
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
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

  describe('page', () => {
    it('should emit the 5 first items with pagSize 5', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(0, 5);
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.page({ pageSize: 5 });
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit items 10 to 15 with pagSize 5 and pageIndex 2', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(10, 15);
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.page({ pageSize: 5, pageIndex: 2 });
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit all items with only pageIndex 2 as no pageSize is specified', (done) => {
      const expectedValues = expectedProductsResponse.value;
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.page({ pageIndex: 2 });
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
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

  describe('filter', () => {
    it('should emit the item with name equals to "Chai" with a string filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value: any) => value.ProductName === 'Chai');
      const filter = {
        ProductName: {
          asODataQueryFilter: () => 'Chai',
        },
      };
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.filter(filter);
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit the item with name equals to "Chai" with an object filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value: any) => value.ProductName === 'Chai');
      const filter = {
        ProductName: {
          asODataQueryFilter: () => ({
            eq: 'Chai',
          }),
        },
      };
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.filter(filter);
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit the items with name containing "Anton" with a string filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value: any) => value.ProductName.includes('Anton'));
      const filter = {
        ProductName: {
          expression: "contains(ProductName, '{term}')",
          asODataQueryFilter: () => "contains(ProductName, 'Anton')",
        },
      };
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.filter(filter);
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit the items with name containing to "Anton" with an object filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value: any) => value.ProductName.includes('Anton'));
      const filter = {
        ProductName: {
          asODataQueryFilter: () => ({
            contains: 'Anton',
          }),
        },
      };
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.filter(filter);
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit the items with name not containing to "Anton" with a string filter', (done) => {
      const expectedValues = expectedProductsResponse.value
        .filter((value: any) => !value.ProductName.includes('Anton'))
        .slice(0, 20);
      const filter = {
        ProductName: {
          negate: true,
          expression: "contains(ProductName, '{term}')",
          asODataQueryFilter: () => "contains(ProductName, 'Anton')",
        },
      };
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.filter(filter);
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit the items with name not containing to "Anton" with an object filter', (done) => {
      const expectedValues = expectedProductsResponse.value
        .filter((value: any) => !value.ProductName.includes('Anton'))
        .slice(0, 20);
      const filter = {
        ProductName: {
          negate: true,
          asODataQueryFilter: () => ({
            contains: 'Anton',
          }),
        },
      };
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.filter(filter);
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
    });
    it('should emit the items from supplier "Exotic Liquids"', (done) => {
      const expectedValues = expectedProductsWithSuppliersResponse.value
        .filter((value: any) => value.Supplier?.Name === 'Exotic Liquids')
        .map(({ Supplier, ...value }: any) => value)
        .slice(0, 20);
      const filter = {
        Supplier: {
          asODataQueryFilter: () => ({
            Name: 'Exotic Liquids',
          }),
        },
      };
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.filter(filter);
            return store.data$;
          }),
          skip(1),
          take(1),
        )
        .subscribe({
          next: (data) => {
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

  describe('selectRows', () => {
    it('should emit selected rows', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(1, 4);
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.selectRows(expectedValues);
            return store.selectedRows$;
          }),
          take(1),
        )
        .subscribe({
          next: (data) => {
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

  describe('expandRow', () => {
    it('should emit expanded rows', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(1, 4);
      store
        .init(config)
        .pipe(
          switchMap((_) => {
            store.expandRow(expectedValues);
            return store.expandedRow$;
          }),
          take(1),
        )
        .subscribe({
          next: (data) => {
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

  describe('reload$', () => {
    it('should (re)emit data', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(0, 20);
      let reloaded = false;
      combineLatest([store.data$, store.init(config)])
        .pipe(
          filter((_) => reloaded),
          take(1),
        )
        .subscribe({
          next: ([data]) => {
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).withContext('error').toBeNull();
            done();
          },
        });
      timer(1000)
        .pipe(
          tap(() => {
            reloaded = true;
            store.reload();
          }),
          take(1),
        )
        .subscribe();
    });
  });
});
