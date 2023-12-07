export type Imports = Record<string, string>;

export type Scopes = Record<string, Imports>;

export interface ImportMap {
  imports: Imports;
  scopes: Scopes;
}
