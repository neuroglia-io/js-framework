import { ImportMap } from '../models/import-map';

export function mergeImportMaps(map1: ImportMap, map2: ImportMap): ImportMap {
  return {
    imports: { ...map1.imports, ...map2.imports },
    scopes: { ...map1.scopes, ...map2.scopes },
  };
}
