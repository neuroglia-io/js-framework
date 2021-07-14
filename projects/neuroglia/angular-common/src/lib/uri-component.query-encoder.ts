import { HttpParameterCodec, HttpUrlEncodingCodec } from '@angular/common/http';

/**
 * Provides encoding and decoding of URL parameter and query-string values
 */
export class URIComponentQueryEncoder implements HttpUrlEncodingCodec, HttpParameterCodec {
    encodeKey(key: string): string { return key; }
    encodeValue(value: string): string { return encodeURIComponent(value); }
    decodeKey(key: string): string { return key; }
    decodeValue(value: string): string { return decodeURIComponent(value); }
}
