/**
 * Contains paging info
 */
export interface Paging {
  /** The index of the current displayed page */
  pageIndex?: number | null;
  /** The number of item per page */
  pageSize?: number | null;
}
