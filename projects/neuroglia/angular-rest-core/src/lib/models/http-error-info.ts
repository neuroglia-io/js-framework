import { ModelConstructor } from '@neuroglia/common';
import { HttpRequestInfo } from './http-request-info';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Describes an http error
 */
export class HttpErrorInfo extends ModelConstructor {
  constructor(model?: any) {
    super(model);
    this.request = new HttpRequestInfo(model?.request || {});
    this.error = new HttpErrorResponse(model?.error || {});
  }

  request: HttpRequestInfo;
  error: HttpErrorResponse;
}
