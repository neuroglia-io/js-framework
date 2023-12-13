export enum ODataPrimitiveTypeEnum {
  /** Binary data */
  Binary = 'Edm.Binary',
  /** Binary-valued logic */
  Boolean = 'Edm.Boolean',
  /** Unsigned 8-bit integer */
  Byte = 'Edm.Byte',
  /** Date without a time-zone offset */
  Date = 'Edm.Date',
  /** Date and time with a time-zone offset, no leap seconds */
  DateTimeOffset = 'Edm.DateTimeOffset',
  /** Numeric values with fixed precision and scale */
  Decimal = 'Edm.Decimal',
  /** IEEE 754 binary64 floating-point number (15-17 decimal digits) */
  Double = 'Edm.Double',
  /** Signed duration in days, hours, minutes, and (sub)seconds */
  Duration = 'Edm.Duration',
  /** 16-byte (128-bit) unique identifier */
  Guid = 'Edm.Guid',
  /** Signed 16-bit integer */
  Int16 = 'Edm.Int16',
  /** Signed 32-bit integer */
  Int32 = 'Edm.Int32',
  /** Signed 64-bit integer */
  Int64 = 'Edm.Int64',
  /** Signed 8-bit integer */
  SByte = 'Edm.SByte',
  /** IEEE 754 binary32 floating-point number (6-9 decimal digits) */
  Single = 'Edm.Single',
  /** Binary data stream */
  Stream = 'Edm.Stream',
  /** Sequence of UTF-8 characters */
  String = 'Edm.String',
  /** Clock time 00:00-23:59:59.999999999999 */
  TimeOfDay = 'Edm.TimeOfDay',
  /** Abstract base type for all Geography types */
  Geography = 'Edm.Geography',
  /** A point in a round-earth coordinate system */
  GeographyPoint = 'Edm.GeographyPoint',
  /** Line string in a round-earth coordinate system */
  GeographyLineString = 'Edm.GeographyLineString',
  /** Polygon in a round-earth coordinate system */
  GeographyPolygon = 'Edm.GeographyPolygon',
  /** Collection of points in a round-earth coordinate system */
  GeographyMultiPoint = 'Edm.GeographyMultiPoint',
  /** Collection of line strings in a round-earth coordinate system */
  GeographyMultiLineString = 'Edm.GeographyMultiLineString',
  /** Collection of polygons in a round-earth coordinate system */
  GeographyMultiPolygon = 'Edm.GeographyMultiPolygon',
  /** Collection of arbitrary Geography values */
  GeographyCollection = 'Edm.GeographyCollection',
  /** Abstract base type for all Geometry types */
  Geometry = 'Edm.Geometry',
  /** Point in a flat-earth coordinate system */
  GeometryPoint = 'Edm.GeometryPoint',
  /** Line string in a flat-earth coordinate system */
  GeometryLineString = 'Edm.GeometryLineString',
  /** Polygon in a flat-earth coordinate system */
  GeometryPolygon = 'Edm.GeometryPolygon',
  /** Collection of points in a flat-earth coordinate system */
  GeometryMultiPoint = 'Edm.GeometryMultiPoint',
  /** Collection of line strings in a flat-earth coordinate system */
  GeometryMultiLineString = 'Edm.GeometryMultiLineString',
  /** Collection of polygons in a flat-earth coordinate system */
  GeometryMultiPolygon = 'Edm.GeometryMultiPolygon',
  /** Collection of arbitrary Geometry values */
  GeometryCollection = 'Edm.GeometryCollection',
  /** Undefined type */
  Untyped = 'Edm.Untyped',
}
