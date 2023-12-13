export declare type ODataPrimitiveType =
  /** Binary data */
  | 'Edm.Binary'
  /** Binary-valued logic */
  | 'Edm.Boolean'
  /** Unsigned 8-bit integer */
  | 'Edm.Byte'
  /** Date without a time-zone offset */
  | 'Edm.Date'
  /** Date and time with a time-zone offset, no leap seconds */
  | 'Edm.DateTimeOffset'
  /** Numeric values with fixed precision and scale */
  | 'Edm.Decimal'
  /** IEEE 754 binary64 floating-point number (15-17 decimal digits) */
  | 'Edm.Double'
  /** Signed duration in days, hours, minutes, and (sub)seconds */
  | 'Edm.Duration'
  /** 16-byte (128-bit) unique identifier */
  | 'Edm.Guid'
  /** Signed 16-bit integer */
  | 'Edm.Int16'
  /** Signed 32-bit integer */
  | 'Edm.Int32'
  /** Signed 64-bit integer */
  | 'Edm.Int64'
  /** Signed 8-bit integer */
  | 'Edm.SByte'
  /** IEEE 754 binary32 floating-point number (6-9 decimal digits) */
  | 'Edm.Single'
  /** Binary data stream */
  | 'Edm.Stream'
  /** Sequence of UTF-8 characters */
  | 'Edm.String'
  /** Clock time 00:00-23:59:59.999999999999 */
  | 'Edm.TimeOfDay'
  /** Abstract base type for all Geography types */
  | 'Edm.Geography'
  /** A point in a round-earth coordinate system */
  | 'Edm.GeographyPoint'
  /** Line string in a round-earth coordinate system */
  | 'Edm.GeographyLineString'
  /** Polygon in a round-earth coordinate system */
  | 'Edm.GeographyPolygon'
  /** Collection of points in a round-earth coordinate system */
  | 'Edm.GeographyMultiPoint'
  /** Collection of line strings in a round-earth coordinate system */
  | 'Edm.GeographyMultiLineString'
  /** Collection of polygons in a round-earth coordinate system */
  | 'Edm.GeographyMultiPolygon'
  /** Collection of arbitrary Geography values */
  | 'Edm.GeographyCollection'
  /** Abstract base type for all Geometry types */
  | 'Edm.Geometry'
  /** Point in a flat-earth coordinate system */
  | 'Edm.GeometryPoint'
  /** Line string in a flat-earth coordinate system */
  | 'Edm.GeometryLineString'
  /** Polygon in a flat-earth coordinate system */
  | 'Edm.GeometryPolygon'
  /** Collection of points in a flat-earth coordinate system */
  | 'Edm.GeometryMultiPoint'
  /** Collection of line strings in a flat-earth coordinate system */
  | 'Edm.GeometryMultiLineString'
  /** Collection of polygons in a flat-earth coordinate system */
  | 'Edm.GeometryMultiPolygon'
  /** Collection of arbitrary Geometry values */
  | 'Edm.GeometryCollection'
  /** Undefined type */
  | 'Edm.Untyped';
