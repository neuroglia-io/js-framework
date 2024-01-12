import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync } from '@angular/core/testing';

import { NeurogliaNgMatODataDataTableComponent } from './angular-material-odata-table.component';
import { provideHttpClient } from '@angular/common/http';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, ODataQueryResultDto, UrlHelperService } from '@neuroglia/angular-rest-core';
import { KeycloakService } from 'keycloak-angular';
import { Metadata, ODataTableStore } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NeurogliaNgCommonModule } from '@neuroglia/angular-common';
import { NeurogliaNgMatQueryableDataTableModule } from '@neuroglia/angular-ui-material-queryable-table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NeurogliaNgUiJsonPresenterModule } from '@neuroglia/angular-ui-json-presenter';
import { combineLatest, filter, from, take } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  QueryableTableConfig,
  expandRowColumnDefinition,
  selectRowColumnDefinition,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { humanCase } from '@neuroglia/common';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatSortHarness } from '@angular/material/sort/testing';

const testEndpoint = 'https://services.radzen.com/odata/Northwind/';

const config: QueryableTableConfig = {
  dataSourceType: 'odata',
  serviceUrl: testEndpoint,
  target: 'NorthwindProducts',
  useMetadata: true,
  columnDefinitions: [],
};

describe('NeurogliaNgMatDataTableComponent', () => {
  const expectedDefaultPageSize = 20;
  let expectedMetadata: Metadata;
  let expectedProductsResponse: ODataQueryResultDto<unknown>;
  //let expectedProductsWithSuppliersResponse: ODataQueryResultDto<unknown>;
  let fixture: ComponentFixture<NeurogliaNgMatODataDataTableComponent>;
  let component: NeurogliaNgMatODataDataTableComponent;
  let componentElement: HTMLElement;
  let loader: HarnessLoader;

  beforeAll((done) => {
    combineLatest([
      from(fetch(testEndpoint + '$metadata?$format=json').then((res) => res.json())),
      from(fetch(testEndpoint + config.target + '?$count=true').then((res) => res.json())),
      //from(fetch(testEndpoint + config.target + '?$count=true&expand=Supplier').then((res) => res.json())),
    ]).subscribe({
      next: ([metadata, products /*, productsWithSuppliers*/]) => {
        expectedMetadata = metadata;
        expectedProductsResponse = products;
        //expectedProductsWithSuppliersResponse = productsWithSuppliers;
        done();
      },
      error: (err) => {
        throw err;
      },
    });
  });

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    await TestBed.configureTestingModule({
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        provideHttpClient(),
        NamedLoggingServiceFactory,
        HttpErrorObserverService,
        UrlHelperService,
        KeycloakService,
        ODataTableStore,
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NeurogliaNgCommonModule,
        NeurogliaNgMatQueryableDataTableModule,

        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatDatepickerModule,
        DragDropModule,

        NeurogliaNgUiJsonPresenterModule,
      ],
      declarations: [NeurogliaNgMatODataDataTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeurogliaNgMatODataDataTableComponent);
    component = fixture.componentInstance;
    componentElement = fixture.nativeElement;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('init', () => {
    it('should display the data table', async () => {
      fixture.componentRef.setInput('configuration', config);
      fixture.detectChanges();
      return fixture.whenStable().then(async () => {
        let expectedColumns = Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct)
          .filter(
            ([key, info]: [string, any]) =>
              !key.startsWith('$') && !info.$Collection && info.$Kind !== 'NavigationProperty',
          )
          .map(([key]) => key);
        if (config.enableSelection === true) {
          expectedColumns = [selectRowColumnDefinition.name, ...expectedColumns];
        }
        if (config.enableRowExpansion === true) {
          expectedColumns = [expandRowColumnDefinition.name, ...expectedColumns];
        }
        const expectedColumnsCount = expectedColumns.length;
        const expectedData = expectedProductsResponse.value.slice(0, expectedDefaultPageSize);
        const facade = componentElement.querySelector('neuroglia-mat-queryable-table-facade');
        const queryableTableEntry = componentElement.querySelector('neuroglia-mat-queryable-table-table');
        const responsiveTable = componentElement.querySelector('.responsive-table > table');
        const thead = responsiveTable?.querySelector('thead');
        const headers = Array.from(thead?.querySelectorAll('th') || []);
        const tbody = responsiveTable?.querySelector('tbody');
        const rows = Array.from(tbody?.querySelectorAll('tr') || []);
        const tfoot = responsiveTable?.querySelector('tfoot');
        const footer = componentElement.querySelector('.table-footer');
        const enableColumnSettings = footer?.querySelector('.column-settings');
        const progressBar = await loader.getHarness(MatProgressBarHarness);
        const paginator = await loader.getHarness(MatPaginatorHarness);

        expect(component).withContext('component').toBeDefined();
        expect(facade).withContext('facade').toBeDefined();
        expect(progressBar).withContext('progressBar').toBeDefined();
        expect(await progressBar.getValue())
          .withContext('progressBar value')
          .toBe(100);
        expect(queryableTableEntry).withContext('queryableTableEntry').toBeDefined();
        expect(responsiveTable).withContext('responsiveTable').toBeDefined();
        expect(thead).withContext('thead').toBeDefined();
        expect(tbody).withContext('tbody').toBeDefined();
        expect(tfoot).withContext('tfoot').toBeDefined();
        expect(footer).withContext('footer').toBeDefined();
        if (config.enableColumnSettings === false) {
          expect(enableColumnSettings).withContext('enableColumnSettings').toBeFalsy();
        } else {
          expect(enableColumnSettings).withContext('enableColumnSettings').toBeDefined();
        }
        expect(paginator).withContext('paginator').toBeDefined();
        expect(headers.length).withContext('headers count').toBe(expectedColumnsCount);
        expect(rows.length).withContext('rows count').toBe(expectedDefaultPageSize);
        expectedColumns.forEach((column, index) => {
          const humanColumn = humanCase(column, true);
          expect(headers[index].textContent).withContext(`header '${humanColumn}'(#${index})`).toContain(humanColumn);
        });
        expectedData.forEach((data: any, index) => {
          const firstCell = rows[index].querySelector('neuroglia-mat-queryable-table-cell-default');
          expect(firstCell?.textContent?.trim()).toEqual(data[expectedColumns[0]].toString());
        });
      });
    });
  });

  describe('paging', () => {
    it('should display the second page with 10 results per page', async () => {
      fixture.componentRef.setInput('configuration', config);
      fixture.detectChanges();
      const expectedPageSize = 10;
      const expectedPageIndex = 1;
      return fixture
        .whenStable()
        .then(() => loader.getHarness(MatPaginatorHarness))
        .then((paginator) => {
          return paginator
            .setPageSize(expectedPageSize)
            .then(() => paginator.goToNextPage())
            .then(() => fixture.whenStable());
        })
        .then(async () => {
          const expectedColumns = Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct)
            .filter(
              ([key, info]: [string, any]) =>
                !key.startsWith('$') && !info.$Collection && info.$Kind !== 'NavigationProperty',
            )
            .map(([key]) => key);
          const start = expectedPageSize * expectedPageIndex;
          const expectedData = expectedProductsResponse.value.slice(start, start + expectedPageSize);
          const facade = componentElement.querySelector('neuroglia-mat-queryable-table-facade');
          const responsiveTable = componentElement.querySelector('.responsive-table > table');
          const tbody = responsiveTable?.querySelector('tbody');
          const rows = Array.from(tbody?.querySelectorAll('tr') || []);
          expect(component).withContext('component').toBeDefined();
          expect(facade).withContext('facade').toBeDefined();
          expect(responsiveTable).withContext('responsiveTable').toBeDefined();
          expect(tbody).withContext('tbody').toBeDefined();
          expect(rows.length).withContext('rows count').toBe(expectedPageSize);
          expectedData.forEach((data: any, index) => {
            const firstCell = rows[index].querySelector('neuroglia-mat-queryable-table-cell-default');
            expect(firstCell?.textContent?.trim()).toEqual(data[expectedColumns[0]].toString());
          });
        });
    });
  });

  describe('sorting', () => {
    it('should sort by first column ascending', async () => {
      component.isLoading$
        .pipe(
          filter((isLoading) => !isLoading),
          take(1),
        )
        .subscribe({
          next: async () => {
            fixture.detectChanges();
          },
        });
      fixture.componentRef.setInput('configuration', config);
      fixture.detectChanges();
      return fixture
        .whenStable()
        .then(() => loader.getHarness(MatSortHarness))
        .then((sort) =>
          sort
            .getSortHeaders()
            .then((sortHeaders) =>
              parallel(() => sortHeaders.map((header) => header.isDisabled())).then((disabled) => {
                const firstEnabled = disabled.findIndex((disabled) => !disabled);
                return sortHeaders[firstEnabled].click();
              }),
            )
            .then(() => fixture.whenStable()),
        )
        .then(async () => {
          const expectedColumns = Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct)
            .filter(
              ([key, info]: [string, any]) =>
                !key.startsWith('$') && !info.$Collection && info.$Kind !== 'NavigationProperty',
            )
            .map(([key]) => key);
          const sortCol = expectedColumns[0];
          const expectedData = expectedProductsResponse.value
            .toSorted((a: any, b: any) => {
              if (typeof a[sortCol] === 'number') {
                return a[sortCol] - b[sortCol];
              } else {
                return a[sortCol].toString().localeCompare(b[sortCol]);
              }
            })
            .slice(0, expectedDefaultPageSize);
          const facade = componentElement.querySelector('neuroglia-mat-queryable-table-facade');
          const responsiveTable = componentElement.querySelector('.responsive-table > table');
          const tbody = responsiveTable?.querySelector('tbody');
          const rows = Array.from(tbody?.querySelectorAll('tr') || []);
          expect(component).withContext('component').toBeDefined();
          expect(facade).withContext('facade').toBeDefined();
          expect(responsiveTable).withContext('responsiveTable').toBeDefined();
          expect(tbody).withContext('tbody').toBeDefined();
          expect(rows.length).withContext('rows count').toBe(expectedDefaultPageSize);
          expectedData.forEach((data: any, index) => {
            const firstCell = rows[index].querySelector('neuroglia-mat-queryable-table-cell-default');
            expect(firstCell?.textContent?.trim()).toEqual(data[expectedColumns[0]].toString());
          });
        });
    });
    it('should sort by first column descending', async () => {
      component.isLoading$
        .pipe(
          filter((isLoading) => !isLoading),
          take(1),
        )
        .subscribe({
          next: async () => {
            fixture.detectChanges();
          },
        });
      fixture.componentRef.setInput('configuration', config);
      fixture.detectChanges();
      return fixture
        .whenStable()
        .then(() => loader.getHarness(MatSortHarness))
        .then((sort) =>
          sort
            .getSortHeaders()
            .then((sortHeaders) =>
              parallel(() => sortHeaders.map((header) => header.isDisabled())).then((disabled) => {
                const firstEnabled = disabled.findIndex((disabled) => !disabled);
                return sortHeaders[firstEnabled].click().then(() => sortHeaders[firstEnabled].click());
              }),
            )
            .then(() => fixture.whenStable()),
        )
        .then(async () => {
          const expectedColumns = Object.entries(expectedMetadata['BlazorWasm7Mssql.Models.Northwind'].NorthwindProduct)
            .filter(
              ([key, info]: [string, any]) =>
                !key.startsWith('$') && !info.$Collection && info.$Kind !== 'NavigationProperty',
            )
            .map(([key]) => key);
          const sortCol = expectedColumns[0];
          const expectedData = expectedProductsResponse.value
            .toSorted((a: any, b: any) => {
              if (typeof a[sortCol] === 'number') {
                return b[sortCol] - a[sortCol];
              } else {
                return b[sortCol].toString().localeCompare(a[sortCol]);
              }
            })
            .slice(0, expectedDefaultPageSize);
          const facade = componentElement.querySelector('neuroglia-mat-queryable-table-facade');
          const responsiveTable = componentElement.querySelector('.responsive-table > table');
          const tbody = responsiveTable?.querySelector('tbody');
          const rows = Array.from(tbody?.querySelectorAll('tr') || []);
          expect(component).withContext('component').toBeDefined();
          expect(facade).withContext('facade').toBeDefined();
          expect(responsiveTable).withContext('responsiveTable').toBeDefined();
          expect(tbody).withContext('tbody').toBeDefined();
          expect(rows.length).withContext('rows count').toBe(expectedDefaultPageSize);
          expectedData.forEach((data: any, index) => {
            const firstCell = rows[index].querySelector('neuroglia-mat-queryable-table-cell-default');
            expect(firstCell?.textContent?.trim()).toEqual(data[expectedColumns[0]].toString());
          });
        });
    });
  });
});
