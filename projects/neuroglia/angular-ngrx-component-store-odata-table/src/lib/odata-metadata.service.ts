import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { get } from '@neuroglia/common';
import { ILogger } from '@neuroglia/logging';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, HttpRequestInfo, logHttpRequest } from '@neuroglia/angular-rest-core';
import { EMPTY, Observable, of } from 'rxjs';
import { expand, map, reduce, switchMap } from 'rxjs/operators';
import { ODataPrimitiveTypeEnum } from './models';
import * as ODataMetadataSchema from './models/odata-metadata';
import { ColumnDefinition } from '@neuroglia/angular-ngrx-component-store-queryable-table';

@Injectable({
  providedIn: 'root',
})
export class ODataMetadataService {
  /** The @see {@link HttpErrorObserverService} */
  protected readonly errorObserver = inject(HttpErrorObserverService);
  /** The @see {@link NamedLoggingServiceFactory} */
  protected readonly namedLoggingServiceFactory = inject(NamedLoggingServiceFactory);
  /** The @see {@link HttpClient} */
  protected readonly http = inject(HttpClient);
  /** The logger instance */
  protected readonly logger: ILogger = this.namedLoggingServiceFactory.create('ODataMetadataService');

  /**
   * Gathers the metadata from the provided service
   * @param serviceUrl
   * @returns
   */
  getMetadata(serviceUrl: string): Observable<ODataMetadataSchema.Metadata> {
    const url: string = `${serviceUrl}${!serviceUrl.endsWith('/') ? '/' : ''}$metadata?$format=json`;
    const httpRequestInfo: HttpRequestInfo = new HttpRequestInfo({
      clientServiceName: 'ODataMetadataService',
      methodName: 'metadata$',
      verb: 'get',
      url,
    });
    return logHttpRequest(
      this.logger,
      this.errorObserver,
      this.http.get<ODataMetadataSchema.Metadata>(url),
      httpRequestInfo,
    );
  }

  /**
   * Gets the entity type description for the provided qualified name
   * @param metadata
   * @param qualifiedName
   * @returns
   */
  getEntityTypeByQualifiedName(
    metadata: ODataMetadataSchema.Metadata,
    qualifiedName: string,
  ): Observable<ODataMetadataSchema.EntityType> {
    return of(this.getElementByQualifiedName(metadata, qualifiedName) as ODataMetadataSchema.EntityType);
  }

  /**
   * Gets the entity type description for the provided entity name
   * @param metadata 
   * @param entityName 
   * @returns 
   
  getEntityTypeByName(metadata: ODataMetadataSchema.Metadata, entityName: string): Observable<ODataMetadataSchema.EntityType> {
    return this.getEntityQualifiedName(metadata, entityName).pipe(
      mergeMap(qualifiedName => this.getEntityTypeByQualifiedName(metadata, qualifiedName))
    );
  }
  */

  /**
   * Gets the column definitions for the provided entity name
   * @param metadata
   * @param entityName
   * @returns
   */
  getColumnDefinitions(metadata: ODataMetadataSchema.Metadata, entityName: string): Observable<ColumnDefinition[]> {
    return this.getEntityQualifiedName(metadata, entityName).pipe(
      switchMap((qualifiedName) => this.getColumnDefinitionInfo(metadata, qualifiedName)),
      expand((info) => {
        if (!info) {
          return EMPTY;
        }
        return this.getColumnDefinitionInfo(metadata, info.baseType);
      }),
      reduce((acc: ColumnDefinition[], info: ColumnDefinitionInfo) => {
        return [...info.columnDefinitions, ...acc];
      }, []),
    );
  }

  /**
   * Gets the column definitions for the provided full qualified entity name
   * @param metadata
   * @param entityName
   * @returns
   */
  getColumnDefinitionsForQualifiedName(
    metadata: ODataMetadataSchema.Metadata,
    qualifiedName: string,
  ): Observable<ColumnDefinition[]> {
    return this.getColumnDefinitionInfo(metadata, qualifiedName).pipe(
      expand((info) => {
        if (!info) {
          return EMPTY;
        }
        return this.getColumnDefinitionInfo(metadata, info.baseType);
      }),
      reduce((acc: ColumnDefinition[], info: ColumnDefinitionInfo) => {
        return [...info.columnDefinitions, ...acc];
      }, []),
    );
  }

  /**
   * Gets the fully qualified name of the provided entity
   * @param metadata
   * @param entityName
   * @returns
   */
  protected getEntityQualifiedName(metadata: ODataMetadataSchema.Metadata, entityName: string): Observable<string> {
    if (!metadata.$EntityContainer) {
      this.logger.error(`The property $EntityContainer is missing on the metadata.`);
      throw new Error(`The property $EntityContainer is missing on the metadata.`);
    }
    const entityType = get(get(metadata, metadata.$EntityContainer), entityName)?.$Type as string;
    if (!entityType) {
      this.logger.error(`Enable to find a metadata container for '${entityName}'.`);
      throw new Error(`Enable to find a metadata container for '${entityName}'.`);
    }
    return of(entityType);
  }

  /**
   * Gets the column deifnition for the provided entity *only*, not its parents
   * @param metadata
   * @param entityName
   * @returns
   */
  protected getColumnDefinitionInfo(
    metadata: ODataMetadataSchema.Metadata,
    qualifiedName?: string,
  ): Observable<ColumnDefinitionInfo> {
    if (!qualifiedName) return EMPTY;
    return this.getEntityTypeByQualifiedName(metadata, qualifiedName).pipe(
      map(
        (entityType) =>
          ({
            baseType: entityType['$BaseType'],
            columnDefinitions: Object.entries(entityType)
              .filter(([key]) => !key.startsWith('$')) // remove metaproperties like $Kind, $Key,...
              .map(([key, info], index) => {
                const name: string = key;
                const position: number = index + 1;
                const isCollection = !!info.$Collection;
                const isNavigationProperty = info.$Kind === 'NavigationProperty';
                const isNullable = !!info.$Nullable;
                const type = info.$Type || ODataPrimitiveTypeEnum.String;
                const isSortable = false;
                const isFilterable = false;
                const isVisible = false;
                const columnDefinition = {
                  name,
                  position,
                  isCollection,
                  isNavigationProperty,
                  isNullable,
                  type,
                  isVisible,
                  isSortable,
                  isFilterable,
                } as ColumnDefinition;
                if (Object.values(ODataPrimitiveTypeEnum).includes(type)) {
                  columnDefinition.isVisible = !isCollection && !isNavigationProperty;
                  columnDefinition.isSortable = !isCollection && !isNavigationProperty;
                  if (
                    type === ODataPrimitiveTypeEnum.String ||
                    type === ODataPrimitiveTypeEnum.Guid ||
                    type === ODataPrimitiveTypeEnum.Date ||
                    type === ODataPrimitiveTypeEnum.DateTimeOffset ||
                    type === ODataPrimitiveTypeEnum.Byte ||
                    type === ODataPrimitiveTypeEnum.Decimal ||
                    type === ODataPrimitiveTypeEnum.Double ||
                    type === ODataPrimitiveTypeEnum.Int16 ||
                    type === ODataPrimitiveTypeEnum.Int32 ||
                    type === ODataPrimitiveTypeEnum.Int64 ||
                    type === ODataPrimitiveTypeEnum.SByte ||
                    type === ODataPrimitiveTypeEnum.Single
                  ) {
                    columnDefinition.isFilterable = !isCollection && !isNavigationProperty;
                  }
                } else if (!isNavigationProperty) {
                  const underlyingEntity = this.getElementByQualifiedName(metadata, type);
                  if (underlyingEntity.$Kind === 'EnumType') {
                    columnDefinition.isVisible = !isCollection && !isNavigationProperty;
                    columnDefinition.isSortable = !isCollection && !isNavigationProperty;
                    columnDefinition.isFilterable = !isCollection && !isNavigationProperty;
                    columnDefinition.type = ODataPrimitiveTypeEnum.String;
                    columnDefinition.isEnum = true;
                    columnDefinition.enumType = info.$Type;
                    columnDefinition.enumValues = Object.keys(underlyingEntity).filter((key) => !key.startsWith('$'));
                  }
                }
                return columnDefinition;
              }),
          }) as ColumnDefinitionInfo,
      ),
    );
  }

  /**
   * Gets the type description for the provided qualified name
   * @param metadata
   * @param qualifiedName
   * @returns
   */
  protected getElementByQualifiedName(
    metadata: ODataMetadataSchema.Metadata,
    qualifiedName: string,
  ): ODataMetadataSchema.EntityType | ODataMetadataSchema.EnumType {
    const pathParts = qualifiedName.split('.');
    const type = pathParts.splice(-1)[0];
    const namespace = pathParts.join('.');
    return metadata[namespace][type];
  }
}

interface ColumnDefinitionInfo {
  baseType?: string;
  columnDefinitions: ColumnDefinition[];
}
