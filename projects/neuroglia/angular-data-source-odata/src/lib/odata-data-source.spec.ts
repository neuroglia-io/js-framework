import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, UrlHelperService } from '@neuroglia/angular-rest-core';
import { ODataDataSource } from './odata-data-source';
import { ODATA_DATA_SOURCE_ENDPOINT } from './odata-data-source-endpoint-token';
import { combineLatest, filter, take, tap, timer } from 'rxjs';

const testEndpoint = 'https://services.odata.org/V4/OData/OData.svc/Products';

const expectedProductsResponse = {
  '@odata.context': 'https://services.odata.org/V4/OData/OData.svc/$metadata#Products',
  '@odata.count': 11,
  value: [
    {
      ID: 0,
      Name: 'Bread',
      Description: 'Whole grain bread',
      ReleaseDate: '1992-01-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 4,
      Price: 2.5,
    },
    {
      ID: 1,
      Name: 'Milk',
      Description: 'Low fat milk',
      ReleaseDate: '1995-10-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 3.5,
    },
    {
      ID: 2,
      Name: 'Vint soda',
      Description: 'Americana Variety - Mix of 6 flavors',
      ReleaseDate: '2000-10-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 20.9,
    },
    {
      ID: 3,
      Name: 'Havina Cola',
      Description: 'The Original Key Lime Cola',
      ReleaseDate: '2005-10-01T00:00:00Z',
      DiscontinuedDate: '2006-10-01T00:00:00Z',
      Rating: 3,
      Price: 19.9,
    },
    {
      ID: 4,
      Name: 'Fruit Punch',
      Description: 'Mango flavor, 8.3 Ounce Cans (Pack of 24)',
      ReleaseDate: '2003-01-05T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 22.99,
    },
    {
      ID: 5,
      Name: 'Cranberry Juice',
      Description: '16-Ounce Plastic Bottles (Pack of 12)',
      ReleaseDate: '2006-08-04T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 22.8,
    },
    {
      ID: 6,
      Name: 'Pink Lemonade',
      Description: '36 Ounce Cans (Pack of 3)',
      ReleaseDate: '2006-11-05T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 18.8,
    },
    {
      ID: 7,
      Name: 'DVD Player',
      Description: '1080P Upconversion DVD Player',
      ReleaseDate: '2006-11-15T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 5,
      Price: 35.88,
    },
    {
      ID: 8,
      Name: 'LCD HDTV',
      Description: '42 inch 1080p LCD with Built-in Blu-ray Disc Player',
      ReleaseDate: '2008-05-08T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 1088.8,
    },
    {
      '@odata.type': '#ODataDemo.FeaturedProduct',
      ID: 9,
      Name: 'Lemonade',
      Description: 'Classic, refreshing lemonade (Single bottle)',
      ReleaseDate: '1970-01-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 7,
      Price: 1.01,
    },
    {
      '@odata.type': '#ODataDemo.FeaturedProduct',
      ID: 10,
      Name: 'Coffee',
      Description: 'Bulk size can of instant coffee',
      ReleaseDate: '1982-12-31T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 1,
      Price: 6.99,
    },
  ],
};

const expectedProductsWithSuppliersResponse = {
  '@odata.context': 'https://services.odata.org/V4/OData/OData.svc/$metadata#Products',
  '@odata.count': 11,
  value: [
    {
      ID: 0,
      Name: 'Bread',
      Description: 'Whole grain bread',
      ReleaseDate: '1992-01-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 4,
      Price: 2.5,
      Supplier: {
        ID: 1,
        Name: 'Tokyo Traders',
        Address: { Street: 'NE 40th', City: 'Redmond', State: 'WA', ZipCode: '98052', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.107711791992, 47.6472206115723],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 1,
      Name: 'Milk',
      Description: 'Low fat milk',
      ReleaseDate: '1995-10-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 3.5,
      Supplier: {
        ID: 0,
        Name: 'Exotic Liquids',
        Address: { Street: 'NE 228th', City: 'Sammamish', State: 'WA', ZipCode: '98074', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.03547668457, 47.6316604614258],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 2,
      Name: 'Vint soda',
      Description: 'Americana Variety - Mix of 6 flavors',
      ReleaseDate: '2000-10-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 20.9,
      Supplier: {
        ID: 0,
        Name: 'Exotic Liquids',
        Address: { Street: 'NE 228th', City: 'Sammamish', State: 'WA', ZipCode: '98074', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.03547668457, 47.6316604614258],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 3,
      Name: 'Havina Cola',
      Description: 'The Original Key Lime Cola',
      ReleaseDate: '2005-10-01T00:00:00Z',
      DiscontinuedDate: '2006-10-01T00:00:00Z',
      Rating: 3,
      Price: 19.9,
      Supplier: {
        ID: 0,
        Name: 'Exotic Liquids',
        Address: { Street: 'NE 228th', City: 'Sammamish', State: 'WA', ZipCode: '98074', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.03547668457, 47.6316604614258],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 4,
      Name: 'Fruit Punch',
      Description: 'Mango flavor, 8.3 Ounce Cans (Pack of 24)',
      ReleaseDate: '2003-01-05T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 22.99,
      Supplier: {
        ID: 0,
        Name: 'Exotic Liquids',
        Address: { Street: 'NE 228th', City: 'Sammamish', State: 'WA', ZipCode: '98074', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.03547668457, 47.6316604614258],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 5,
      Name: 'Cranberry Juice',
      Description: '16-Ounce Plastic Bottles (Pack of 12)',
      ReleaseDate: '2006-08-04T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 22.8,
      Supplier: {
        ID: 0,
        Name: 'Exotic Liquids',
        Address: { Street: 'NE 228th', City: 'Sammamish', State: 'WA', ZipCode: '98074', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.03547668457, 47.6316604614258],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 6,
      Name: 'Pink Lemonade',
      Description: '36 Ounce Cans (Pack of 3)',
      ReleaseDate: '2006-11-05T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 18.8,
      Supplier: {
        ID: 0,
        Name: 'Exotic Liquids',
        Address: { Street: 'NE 228th', City: 'Sammamish', State: 'WA', ZipCode: '98074', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.03547668457, 47.6316604614258],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 7,
      Name: 'DVD Player',
      Description: '1080P Upconversion DVD Player',
      ReleaseDate: '2006-11-15T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 5,
      Price: 35.88,
      Supplier: {
        ID: 1,
        Name: 'Tokyo Traders',
        Address: { Street: 'NE 40th', City: 'Redmond', State: 'WA', ZipCode: '98052', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.107711791992, 47.6472206115723],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      ID: 8,
      Name: 'LCD HDTV',
      Description: '42 inch 1080p LCD with Built-in Blu-ray Disc Player',
      ReleaseDate: '2008-05-08T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 3,
      Price: 1088.8,
      Supplier: {
        ID: 1,
        Name: 'Tokyo Traders',
        Address: { Street: 'NE 40th', City: 'Redmond', State: 'WA', ZipCode: '98052', Country: 'USA' },
        Location: {
          type: 'Point',
          coordinates: [-122.107711791992, 47.6472206115723],
          crs: { type: 'name', properties: { name: 'EPSG:4326' } },
        },
        Concurrency: 0,
      },
    },
    {
      '@odata.type': '#ODataDemo.FeaturedProduct',
      ID: 9,
      Name: 'Lemonade',
      Description: 'Classic, refreshing lemonade (Single bottle)',
      ReleaseDate: '1970-01-01T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 7,
      Price: 1.01,
      Supplier: null,
    },
    {
      '@odata.type': '#ODataDemo.FeaturedProduct',
      ID: 10,
      Name: 'Coffee',
      Description: 'Bulk size can of instant coffee',
      ReleaseDate: '1982-12-31T00:00:00Z',
      DiscontinuedDate: null,
      Rating: 1,
      Price: 6.99,
      Supplier: null,
    },
  ],
};

describe('OData Data Source', () => {
  let datasource: ODataDataSource;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        NamedLoggingServiceFactory,
        HttpErrorObserverService,
        UrlHelperService,
        { provide: ODATA_DATA_SOURCE_ENDPOINT, useValue: testEndpoint },
        ODataDataSource,
      ],
      teardown: { destroyAfterEach: false },
    });
    datasource = TestBed.inject(ODataDataSource);
  });

  afterEach(() => datasource.disconnect());

  describe('no parameters', () => {
    it('should emit all items with no parameters set', (done) => {
      combineLatest([datasource.response$, datasource.data$]).subscribe({
        next: ([response, data]) => {
          expect(response).toEqual(expectedProductsResponse);
          expect(data).toEqual(expectedProductsResponse.value);
          done();
        },
      });
    });
  });

  describe('reload', () => {
    it('should (re)emit all items', (done) => {
      let reloaded = false;
      datasource.data$.pipe(filter((_) => reloaded)).subscribe({
        next: (data) => {
          expect(data).toEqual(expectedProductsResponse.value);
          done();
        },
      });
      timer(1000)
        .pipe(
          tap(() => {
            reloaded = true;
            datasource.reload();
          }),
          take(1),
        )
        .subscribe();
    });
  });

  describe('select', () => {
    it('should emit all names', (done) => {
      const expectedValues = expectedProductsResponse.value.map((value) => {
        if (!value['@odata.type']) return { Name: value.Name };
        return { Name: value.Name, '@odata.type': value['@odata.type'] };
      });
      datasource
        .select(['Name'])
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
  });

  describe('expand', () => {
    it('should emit all items with their supplier', (done) => {
      datasource
        .expand(['Supplier'])
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedProductsWithSuppliersResponse.value.length);
            expect(data).toEqual(expectedProductsWithSuppliersResponse.value);
            done();
          },
        });
    });
  });

  describe('paging', () => {
    it('should emit the 5 first items with pagSize 5', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(0, 5);
      datasource
        .page({ pageSize: 5 })
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });

    it('should emit the last item with pagSize 5 and pageIndex 2', (done) => {
      const expectedValues = expectedProductsResponse.value.slice(-1);
      datasource
        .page({ pageSize: 5, pageIndex: 2 }) // zeroed index ==> skip 10; 1 left
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });

    it('should emit all items with only pageIndex 2 as no pageSize is specified', (done) => {
      const datasource = TestBed.inject(ODataDataSource);
      datasource
        .page({ pageIndex: 2 })
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(11);
            expect(data).toEqual(expectedProductsResponse.value);
            done();
          },
        });
    });
  });

  describe('orderBy', () => {
    it('should emit all the items ordered by name', (done) => {
      const expectedValues = expectedProductsResponse.value.toSorted((a, b) => a.Name.localeCompare(b.Name));
      datasource
        .orderBy([{ column: 'Name', direction: 'asc' }])
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
    it('should emit all the items ordered by descending name', (done) => {
      const expectedValues = expectedProductsResponse.value.toSorted((a, b) => b.Name.localeCompare(a.Name));
      datasource
        .orderBy([{ column: 'Name', direction: 'desc' }])
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
  });

  describe('filter', () => {
    it('should emit the item with name equals to "Bread" with a string filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value) => value.Name === 'Bread');
      datasource
        .filter(`Name eq 'Bread'`)
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
    it('should emit the item with name equals to "Bread" with an object filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value) => value.Name === 'Bread');
      datasource
        .filter({ Name: 'Bread' })
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
    it('should emit the items with name containing "ui" with a string filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value) => value.Name.includes('ui'));
      datasource
        .filter(`contains(Name, 'ui')`)
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
    it('should emit the items with name containing "ui" with an object filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value) => value.Name.includes('ui'));
      datasource
        .filter({ Name: { contains: 'ui' } })
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
    it('should emit the items with name not containing "ui" with a string filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value) => !value.Name.includes('ui'));
      datasource
        .filter(`not(contains(Name, 'ui'))`)
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
    it('should emit the items with name not containing "ui" with an object filter', (done) => {
      const expectedValues = expectedProductsResponse.value.filter((value) => !value.Name.includes('ui'));
      datasource
        .filter({ not: { Name: { contains: 'ui' } } })
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
    it('should emit the items from supplier "Exotic Liquids"', (done) => {
      const expectedValues = expectedProductsWithSuppliersResponse.value
        .filter((value) => value.Supplier?.Name === 'Exotic Liquids')
        .map(({ Supplier, ...value }) => value);
      datasource
        .filter({ Supplier: { Name: 'Exotic Liquids' } })
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
  });

  describe('mixed operations', () => {
    it('should emit the names and suppliers of the first two items from supplier "Exotic Liquids" ordered by name', (done) => {
      const expectedValues = expectedProductsWithSuppliersResponse.value
        .filter((value) => value.Supplier?.Name === 'Exotic Liquids')
        .map(({ Name, Supplier, ...value }) => ({ Name, Supplier }))
        .toSorted((a, b) => a.Name.localeCompare(b.Name));
      datasource
        .expand(['Supplier'])
        .select(['Name', 'Supplier'])
        .orderBy([{ column: 'Name', direction: 'asc' }])
        .filter({ Supplier: { Name: 'Exotic Liquids' } })
        .data$.pipe(take(1))
        .subscribe({
          next: (data) => {
            expect(data.length).toEqual(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
        });
    });
  });
});
