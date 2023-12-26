import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, ODataQueryResultDto, UrlHelperService } from '@neuroglia/angular-rest-core';
import { ODataTableStore } from './odata-table.store';
import { Metadata, ODataTableConfig } from './models';
import { KeycloakService } from 'keycloak-angular';
import { combineLatest, filter, from, skip, switchMap, take, tap, timer } from 'rxjs';

const testEndpoint = 'https://services.radzen.com/odata/Northwind/';

const config: ODataTableConfig = {
  dataSourceType: 'odata',
  serviceUrl: testEndpoint,
  entityName: 'NorthwindProducts',
  useMetadata: true,
  columnDefinitions: [],
};

const expectedMetadata: Metadata = {
  $Version: '4.0',
  $EntityContainer: 'Default.Container',
  'BlazorWasm7Mssql.Models.Sample': {
    Order: {
      $Kind: 'EntityType',
      $Key: ['Id'],
      Id: {
        $Type: 'Edm.Int32',
      },
      UserName: {
        $Nullable: true,
      },
      OrderDate: {
        $Type: 'Edm.DateTimeOffset',
        $Precision: 0,
      },
      OrderDetails: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Sample.OrderDetail',
      },
    },
    OrderDetail: {
      $Kind: 'EntityType',
      $Key: ['Id'],
      Id: {
        $Type: 'Edm.Int32',
      },
      Quantity: {
        $Type: 'Edm.Int32',
      },
      OrderId: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      ProductId: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      Order: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Sample.Order',
        $ReferentialConstraint: {
          OrderId: 'Id',
        },
      },
      Product: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Sample.Product',
        $ReferentialConstraint: {
          ProductId: 'Id',
        },
      },
    },
    Product: {
      $Kind: 'EntityType',
      $Key: ['Id'],
      Id: {
        $Type: 'Edm.Int32',
      },
      ProductName: {
        $Nullable: true,
      },
      ProductPrice: {
        $Type: 'Edm.Decimal',
      },
      ProductPicture: {
        $Nullable: true,
      },
      OrderDetails: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Sample.OrderDetail',
      },
    },
  },
  'BlazorWasm7Mssql.Models.Northwind': {
    Category: {
      $Kind: 'EntityType',
      $Key: ['CategoryID'],
      CategoryID: {
        $Type: 'Edm.Int32',
      },
      CategoryName: {
        $Nullable: true,
      },
      Description: {
        $Nullable: true,
      },
      Picture: {
        $Nullable: true,
      },
      NorthwindProducts: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindProduct',
      },
    },
    Customer: {
      $Kind: 'EntityType',
      $Key: ['CustomerID'],
      CustomerID: {},
      CompanyName: {
        $Nullable: true,
      },
      ContactName: {
        $Nullable: true,
      },
      ContactTitle: {
        $Nullable: true,
      },
      Address: {
        $Nullable: true,
      },
      City: {
        $Nullable: true,
      },
      Region: {
        $Nullable: true,
      },
      PostalCode: {
        $Nullable: true,
      },
      Country: {
        $Nullable: true,
      },
      Phone: {
        $Nullable: true,
      },
      Fax: {
        $Nullable: true,
      },
      CustomerCustomerDemos: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.CustomerCustomerDemo',
      },
      NorthwindOrders: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrder',
      },
    },
    CustomerCustomerDemo: {
      $Kind: 'EntityType',
      $Key: ['CustomerID', 'CustomerTypeID'],
      CustomerID: {
        $Nullable: true,
      },
      CustomerTypeID: {},
      Customer: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Customer',
        $ReferentialConstraint: {
          CustomerID: 'CustomerID',
        },
      },
      CustomerDemographic: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.CustomerDemographic',
      },
    },
    CustomerDemographic: {
      $Kind: 'EntityType',
      $Key: ['CustomerTypeID'],
      CustomerTypeID: {},
      CustomerDesc: {
        $Nullable: true,
      },
      CustomerCustomerDemos: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.CustomerCustomerDemo',
      },
    },
    Employee: {
      $Kind: 'EntityType',
      $Key: ['EmployeeID'],
      EmployeeID: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      LastName: {
        $Nullable: true,
      },
      FirstName: {
        $Nullable: true,
      },
      Title: {
        $Nullable: true,
      },
      TitleOfCourtesy: {
        $Nullable: true,
      },
      BirthDate: {
        $Type: 'Edm.DateTimeOffset',
        $Nullable: true,
        $Precision: 0,
      },
      HireDate: {
        $Type: 'Edm.DateTimeOffset',
        $Nullable: true,
        $Precision: 0,
      },
      Address: {
        $Nullable: true,
      },
      City: {
        $Nullable: true,
      },
      Region: {
        $Nullable: true,
      },
      PostalCode: {
        $Nullable: true,
      },
      Country: {
        $Nullable: true,
      },
      HomePhone: {
        $Nullable: true,
      },
      Extension: {
        $Nullable: true,
      },
      Photo: {
        $Nullable: true,
      },
      Notes: {
        $Nullable: true,
      },
      ReportsTo: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      PhotoPath: {
        $Nullable: true,
      },
      Employees1: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Employee',
      },
      EmployeeTerritories: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.EmployeeTerritory',
      },
      NorthwindOrders: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrder',
      },
      Employee1: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Employee',
        $ReferentialConstraint: {
          EmployeeID: 'EmployeeID',
        },
      },
    },
    EmployeeTerritory: {
      $Kind: 'EntityType',
      $Key: ['EmployeeID', 'TerritoryID'],
      EmployeeID: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      TerritoryID: {
        $Nullable: true,
      },
      Employee: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Employee',
        $ReferentialConstraint: {
          EmployeeID: 'EmployeeID',
        },
      },
      Territory: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Territory',
        $ReferentialConstraint: {
          TerritoryID: 'TerritoryID',
        },
      },
    },
    NorthwindOrder: {
      $Kind: 'EntityType',
      $Key: ['OrderID'],
      OrderID: {
        $Type: 'Edm.Int32',
      },
      CustomerID: {
        $Nullable: true,
      },
      EmployeeID: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      OrderDate: {
        $Type: 'Edm.DateTimeOffset',
        $Nullable: true,
        $Precision: 0,
      },
      RequiredDate: {
        $Type: 'Edm.DateTimeOffset',
        $Nullable: true,
        $Precision: 0,
      },
      ShippedDate: {
        $Type: 'Edm.DateTimeOffset',
        $Nullable: true,
        $Precision: 0,
      },
      ShipVia: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      Freight: {
        $Type: 'Edm.Decimal',
        $Nullable: true,
      },
      ShipName: {
        $Nullable: true,
      },
      ShipAddress: {
        $Nullable: true,
      },
      ShipCity: {
        $Nullable: true,
      },
      ShipRegion: {
        $Nullable: true,
      },
      ShipPostalCode: {
        $Nullable: true,
      },
      ShipCountry: {
        $Nullable: true,
      },
      NorthwindOrderDetails: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrderDetail',
      },
      Customer: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Customer',
        $ReferentialConstraint: {
          CustomerID: 'CustomerID',
        },
      },
      Employee: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Employee',
        $ReferentialConstraint: {
          EmployeeID: 'EmployeeID',
        },
      },
      Shipper: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Shipper',
      },
    },
    NorthwindOrderDetail: {
      $Kind: 'EntityType',
      $Key: ['OrderID', 'ProductID'],
      OrderID: {
        $Type: 'Edm.Int32',
      },
      ProductID: {
        $Type: 'Edm.Int32',
      },
      UnitPrice: {
        $Type: 'Edm.Double',
      },
      Quantity: {
        $Type: 'Edm.Int16',
      },
      Discount: {
        $Type: 'Edm.Single',
      },
      NorthwindOrder: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrder',
      },
      NorthwindProduct: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindProduct',
      },
    },
    NorthwindProduct: {
      $Kind: 'EntityType',
      $Key: ['ProductID'],
      ProductID: {
        $Type: 'Edm.Int32',
      },
      ProductName: {
        $Nullable: true,
      },
      SupplierID: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      CategoryID: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      QuantityPerUnit: {
        $Nullable: true,
      },
      UnitPrice: {
        $Type: 'Edm.Decimal',
        $Nullable: true,
      },
      UnitsInStock: {
        $Type: 'Edm.Int16',
        $Nullable: true,
      },
      UnitsOnOrder: {
        $Type: 'Edm.Int16',
        $Nullable: true,
      },
      ReorderLevel: {
        $Type: 'Edm.Int16',
        $Nullable: true,
      },
      Discontinued: {
        $Type: 'Edm.Boolean',
      },
      NorthwindOrderDetails: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrderDetail',
      },
      Supplier: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Supplier',
        $ReferentialConstraint: {
          SupplierID: 'SupplierID',
        },
      },
      Category: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Category',
        $ReferentialConstraint: {
          CategoryID: 'CategoryID',
        },
      },
    },
    Region: {
      $Kind: 'EntityType',
      $Key: ['RegionID'],
      RegionID: {
        $Type: 'Edm.Int32',
      },
      RegionDescription: {
        $Nullable: true,
      },
      Territories: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Territory',
      },
    },
    Shipper: {
      $Kind: 'EntityType',
      $Key: ['ShipperID'],
      ShipperID: {
        $Type: 'Edm.Int32',
      },
      CompanyName: {
        $Nullable: true,
      },
      Phone: {
        $Nullable: true,
      },
      NorthwindOrders: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrder',
      },
    },
    Supplier: {
      $Kind: 'EntityType',
      $Key: ['SupplierID'],
      SupplierID: {
        $Type: 'Edm.Int32',
      },
      CompanyName: {
        $Nullable: true,
      },
      ContactName: {
        $Nullable: true,
      },
      ContactTitle: {
        $Nullable: true,
      },
      Address: {
        $Nullable: true,
      },
      City: {
        $Nullable: true,
      },
      Region: {
        $Nullable: true,
      },
      PostalCode: {
        $Nullable: true,
      },
      Country: {
        $Nullable: true,
      },
      Phone: {
        $Nullable: true,
      },
      Fax: {
        $Nullable: true,
      },
      HomePage: {
        $Nullable: true,
      },
      NorthwindProducts: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindProduct',
      },
    },
    Territory: {
      $Kind: 'EntityType',
      $Key: ['TerritoryID'],
      TerritoryID: {},
      TerritoryDescription: {
        $Nullable: true,
      },
      RegionID: {
        $Type: 'Edm.Int32',
        $Nullable: true,
      },
      EmployeeTerritories: {
        $Kind: 'NavigationProperty',
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.EmployeeTerritory',
      },
      Region: {
        $Kind: 'NavigationProperty',
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Region',
        $ReferentialConstraint: {
          RegionID: 'RegionID',
        },
      },
    },
    TestCustomers: {
      $Kind: 'EntityType',
      $Key: ['CustomerID'],
      CustomerID: {},
      CompanyName: {
        $Nullable: true,
      },
      ContactName: {
        $Nullable: true,
      },
      ContactTitle: {
        $Nullable: true,
      },
      Address: {
        $Nullable: true,
      },
      City: {
        $Nullable: true,
      },
      Region: {
        $Nullable: true,
      },
      PostalCode: {
        $Nullable: true,
      },
      Country: {
        $Nullable: true,
      },
      Phone: {
        $Nullable: true,
      },
      Fax: {
        $Nullable: true,
      },
    },
  },
  Default: {
    Container: {
      $Kind: 'EntityContainer',
      Orders: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Sample.Order',
        $NavigationPropertyBinding: {
          OrderDetails: 'OrderDetails',
        },
      },
      OrderDetails: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Sample.OrderDetail',
        $NavigationPropertyBinding: {
          Order: 'Orders',
          Product: 'Products',
        },
      },
      Products: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Sample.Product',
        $NavigationPropertyBinding: {
          OrderDetails: 'OrderDetails',
        },
      },
      Categories: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Category',
        $NavigationPropertyBinding: {
          NorthwindProducts: 'NorthwindProducts',
        },
      },
      Customers: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Customer',
        $NavigationPropertyBinding: {
          CustomerCustomerDemos: 'CustomerCustomerDemos',
          NorthwindOrders: 'NorthwindOrders',
        },
      },
      CustomerCustomerDemos: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.CustomerCustomerDemo',
        $NavigationPropertyBinding: {
          Customer: 'Customers',
          CustomerDemographic: 'CustomerDemographics',
        },
      },
      CustomerDemographics: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.CustomerDemographic',
        $NavigationPropertyBinding: {
          CustomerCustomerDemos: 'CustomerCustomerDemos',
        },
      },
      Employees: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Employee',
        $NavigationPropertyBinding: {
          Employee1: 'Employees',
          Employees1: 'Employees',
          EmployeeTerritories: 'EmployeeTerritories',
          NorthwindOrders: 'NorthwindOrders',
        },
      },
      EmployeeTerritories: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.EmployeeTerritory',
        $NavigationPropertyBinding: {
          Employee: 'Employees',
          Territory: 'Territories',
        },
      },
      NorthwindOrders: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrder',
        $NavigationPropertyBinding: {
          Customer: 'Customers',
          Employee: 'Employees',
          NorthwindOrderDetails: 'NorthwindOrderDetails',
          Shipper: 'Shippers',
        },
      },
      NorthwindOrderDetails: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindOrderDetail',
        $NavigationPropertyBinding: {
          NorthwindOrder: 'NorthwindOrders',
          NorthwindProduct: 'NorthwindProducts',
        },
      },
      NorthwindProducts: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.NorthwindProduct',
        $NavigationPropertyBinding: {
          Category: 'Categories',
          NorthwindOrderDetails: 'NorthwindOrderDetails',
          Supplier: 'Suppliers',
        },
      },
      Regions: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Region',
        $NavigationPropertyBinding: {
          Territories: 'Territories',
        },
      },
      Shippers: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Shipper',
        $NavigationPropertyBinding: {
          NorthwindOrders: 'NorthwindOrders',
        },
      },
      Suppliers: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Supplier',
        $NavigationPropertyBinding: {
          NorthwindProducts: 'NorthwindProducts',
        },
      },
      Territories: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.Territory',
        $NavigationPropertyBinding: {
          EmployeeTerritories: 'EmployeeTerritories',
          Region: 'Regions',
        },
      },
      TestCustomers: {
        $Collection: true,
        $Type: 'BlazorWasm7Mssql.Models.Northwind.TestCustomers',
      },
    },
  },
};

describe('OData Table Store', () => {
  let store: ODataTableStore;
  let expectedProductsResponse: ODataQueryResultDto<unknown>;
  let expectedProductsWithSuppliersResponse: ODataQueryResultDto<unknown>;

  beforeAll((done) => {
    combineLatest([
      from(fetch(testEndpoint + config.entityName + '?$count=true').then((res) => res.json())),
      from(fetch(testEndpoint + config.entityName + '?$count=true&expand=Supplier').then((res) => res.json())),
    ]).subscribe({
      next: ([products, productsWithSuppliers]) => {
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
          expect(state.dataUrl).toBe(config.serviceUrl + config.entityName);
          expect(state.columnDefinitions.length).toBe(expectedProperties.length);
          done();
        },
        error: (err) => {
          expect(err).toBeNull();
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
          expect(state.dataUrl).toBe(config.serviceUrl + config.entityName);
          expect(data.length).toBe(expectedValues.length);
          expect(data).toEqual(expectedValues);
          done();
        },
        error: (err) => {
          expect(err).toBeNull();
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
            expect(state.dataUrl).toBe(config.serviceUrl + config.entityName);
            expect(data.length).toBe(expectedValues.length);
            expect(data).toEqual(expectedValues);
            done();
          },
          error: (err) => {
            expect(err).toBeNull();
            done();
          },
        });
      }),
      it('should fail for unknown entity', (done) => {
        store
          .init({
            ...config,
            entityName: 'foobar',
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
          expect(state.dataUrl).toBe(config.serviceUrl + config.entityName);
          expect(data.length).toBe(expectedValues.length);
          expect(data).toEqual(expectedValues);
          done();
        },
        error: (err) => {
          expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
            expect(err).toBeNull();
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
