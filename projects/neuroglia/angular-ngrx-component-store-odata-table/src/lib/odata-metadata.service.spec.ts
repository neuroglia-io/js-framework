import { TestBed } from '@angular/core/testing';
import { ODataMetadataService } from './odata-metadata.service';
import { provideHttpClient } from '@angular/common/http';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, UrlHelperService } from '@neuroglia/angular-rest-core';
import { EntityType, Metadata } from './models/odata-metadata';
import { switchMap } from 'rxjs';
import { ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';

const corsProxy = (url: string, encodeUrl: boolean = false): string =>
  'https://api.allorigins.win/raw?url=' + (encodeUrl ? encodeURIComponent(url) : url);

const testEndpoint = 'https://services.radzen.com/odata/Northwind/';

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

describe('OData Metadata Service', () => {
  let service: ODataMetadataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), NamedLoggingServiceFactory, HttpErrorObserverService, UrlHelperService],
    });
    service = TestBed.inject(ODataMetadataService);
  });

  describe('getMetadata', () => {
    it('should return metadata', (done) => {
      service.getMetadata(testEndpoint).subscribe({
        next: (metadata) => {
          expect(metadata).toEqual(expectedMetadata);
          done();
        },
        error: (err) => {
          expect(err).toBeNull();
          done();
        },
      });
    });
    it("should fail when service doesn't support JSON metadata", (done) => {
      service.getMetadata('https://services.odata.org/V4/OData/OData.svc/').subscribe({
        next: (metadata) => {
          expect(metadata).not.toEqual(expectedMetadata);
          done();
        },
        error: (err) => {
          expect(err.statusText).toBe('Unsupported Media Type');
          done();
        },
      });
    });
    it('should fail when service returns XML instead of JSON', (done) => {
      service.getMetadata(corsProxy('https://odata.domain.fi/v4/odata/')).subscribe({
        next: (metadata) => {
          expect(metadata).not.toEqual(expectedMetadata);
          done();
        },
        error: (err) => {
          expect(err.message).toContain(`Http failure during parsing for`);
          done();
        },
      });
    });
  });

  describe('getEntityTypeByQualifiedName', () => {
    it('should return EntityType for "BlazorWasm7Mssql.Models.Northwind.NorthwindProduct"', (done) => {
      service
        .getMetadata(testEndpoint)
        .pipe(
          switchMap((metadata) =>
            service.getEntityTypeByQualifiedName(metadata, 'BlazorWasm7Mssql.Models.Northwind.NorthwindProduct'),
          ),
        )
        .subscribe({
          next: (entityType: EntityType) => {
            expect(entityType).toEqual(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct);
            done();
          },
          error: (err) => {
            expect(err).toBeNull();
            done();
          },
        });
    });
  });

  describe('getColumnDefinitions', () => {
    it('should return column definitions of "NorthwindProducts" from metadata', (done) => {
      const expectedProperties = [
        //...Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].BaseType),
        ...Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct),
      ]
        .filter(([key]) => !key.startsWith('$'))
        .map(([key]) => key);
      service
        .getMetadata(testEndpoint)
        .pipe(switchMap((metadata) => service.getColumnDefinitions(metadata, 'NorthwindProducts')))
        .subscribe({
          next: (definitions: ColumnDefinition[]) => {
            expect(definitions).not.toBeNull();
            expect(definitions.length).toBe(expectedProperties.length);
            expect(definitions.map((def) => def.name)).toEqual(expectedProperties);
            done();
          },
          error: (err) => {
            expect(err).toBeNull();
            done();
          },
        });
    });
    it('should throw empty for an unknown entity', (done) => {
      service
        .getMetadata(testEndpoint)
        .pipe(switchMap((metadata) => service.getColumnDefinitions(metadata, 'foobar')))
        .subscribe({
          next: (definitions: ColumnDefinition[]) => {
            expect(definitions).toBeNull();
            done();
          },
          error: (err) => {
            expect(err.message).toBe("Enable to find a metadata container for 'foobar'.");
            done();
          },
        });
    });
  });

  describe('getColumnDefinitionsForQualifiedName', () => {
    it('should return column definitions of "BlazorWasm7Mssql.Models.Northwind.NorthwindProduct" from metadata', (done) => {
      const expectedProperties = [
        //...Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].BaseType),
        ...Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct),
      ]
        .filter(([key]) => !key.startsWith('$'))
        .map(([key]) => key);
      service
        .getMetadata(testEndpoint)
        .pipe(
          switchMap((metadata) =>
            service.getColumnDefinitionsForQualifiedName(
              metadata,
              'BlazorWasm7Mssql.Models.Northwind.NorthwindProduct',
            ),
          ),
        )
        .subscribe({
          next: (definitions: ColumnDefinition[]) => {
            expect(definitions).not.toBeNull();
            expect(definitions.length).toBe(expectedProperties.length);
            expect(definitions.map((def) => def.name)).toEqual(expectedProperties);
            done();
          },
          error: (err) => {
            expect(err).toBeNull();
            done();
          },
        });
    });
    it('should throw for an unknown entity', (done) => {
      service
        .getMetadata(testEndpoint)
        .pipe(switchMap((metadata) => service.getColumnDefinitionsForQualifiedName(metadata, 'foobar')))
        .subscribe({
          next: (definitions: ColumnDefinition[]) => {
            expect(definitions).toBeNull();
            done();
          },
          error: (err) => {
            expect(err.message).toContain('Cannot read properties of undefined');
            done();
          },
        });
    });
  });
});
