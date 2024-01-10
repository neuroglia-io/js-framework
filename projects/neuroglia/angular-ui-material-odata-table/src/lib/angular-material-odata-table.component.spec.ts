import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync } from '@angular/core/testing';

import { NeurogliaNgMatDataTableComponent } from './angular-material-odata-table.component';
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

const testEndpoint = 'https://services.radzen.com/odata/Northwind/';

const config: QueryableTableConfig = {
  dataSourceType: 'odata',
  serviceUrl: testEndpoint,
  target: 'NorthwindProducts',
  useMetadata: true,
  columnDefinitions: [],
};

describe('NeurogliaNgMatDataTableComponent', () => {
  let expectedMetadata: Metadata;
  let expectedProductsResponse: ODataQueryResultDto<unknown>;
  let expectedProductsWithSuppliersResponse: ODataQueryResultDto<unknown>;
  let fixture: ComponentFixture<NeurogliaNgMatDataTableComponent>;
  let component: NeurogliaNgMatDataTableComponent;
  let componentElement: HTMLElement;

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
      declarations: [NeurogliaNgMatDataTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeurogliaNgMatDataTableComponent);
    component = fixture.componentInstance;
    componentElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should display the data table', async () => {
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
    return fixture.whenStable().then(() => {
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
      let expectedColumnsCount = expectedColumns.length;
      const facade = componentElement.querySelector('neuroglia-mat-queryable-table-facade');
      const progressBar = componentElement.querySelector('mat-progress-bar');
      const queryableTableEntry = componentElement.querySelector('neuroglia-mat-queryable-table-table');
      const responsiveTable = componentElement.querySelector('.responsive-table > table');
      const thead = responsiveTable?.querySelector('thead');
      const headers = Array.from(thead?.querySelectorAll('th') || []);
      const tbody = responsiveTable?.querySelector('tbody');
      const rows = Array.from(tbody?.querySelectorAll('tr') || []);
      const tfoot = responsiveTable?.querySelector('tfoot');
      const footer = componentElement.querySelector('.table-footer');
      const enableColumnSettings = footer?.querySelector('.column-settings');
      const paginator = footer?.querySelector('mat-paginator');

      expect(component).withContext('component').toBeDefined();
      expect(facade).withContext('facade').toBeDefined();
      expect(progressBar).withContext('progressBar').toBeDefined();
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
      expect(rows.length).withContext('rows count').toBe(20);
      expectedColumns.forEach((column, index) => {
        const humanColumn = humanCase(column, true);
        expect(headers[index].textContent).withContext(`header '${humanColumn}'(#${index})`).toContain(humanColumn);
      });
    });
  });
});
