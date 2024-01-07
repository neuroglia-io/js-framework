import { Expand, Filter, OrderBy, Select, Transform } from 'odata-query';

export type SelectParam<T> = { select: Select<T> } | null;
export type ExpandParam<T> = { expand: Expand<T> } | null;
export type PagingParam = { top?: number; skip?: number } | null;
export type OrderByParam<T> = { orderBy: OrderBy<T> } | null;
export type SearchParam = { search: string } | null;
export type TransformParam<T> = { transform: Transform<T> } | null;
export type FilterParam = { filter: Filter } | null;
export type CountParam = { count: boolean } | null;
export type CombinedParams<T> = [
  SelectParam<T>,
  ExpandParam<T>,
  PagingParam,
  OrderByParam<T>,
  SearchParam,
  TransformParam<T>,
  FilterParam,
  CountParam,
  null,
];
