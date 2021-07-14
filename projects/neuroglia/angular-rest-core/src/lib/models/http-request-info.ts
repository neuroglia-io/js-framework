import { ModelConstructor } from "@neuroglia/common";
import { HttpParams } from '@angular/common/http';

/**
* Describes an http request
*/
export class HttpRequestInfo extends ModelConstructor
 {

  constructor(model?: any) {
    super(model);
  }

  clientServiceName: string;
  methodName: string;
  verb: string;
  url: string;
  params: HttpParams | null | undefined;
  postData: string;
  formData: FormData | null | undefined;
  get info(): string {
    let info: string = `${this.clientServiceName}.${this.methodName} ${this.verb} ${this.url}`;
    if (this.params && this.params.keys().length) {
      info += ` - params: ${this.params.toString()}`;
    }
    if (this.postData) {
      info += ` - json: ${this.postData}`;
    }
    if (this.formData && Array.from(this.formData.keys()).length) {
      info += ` - formData: `;
      info += Array.from(this.formData.entries())
        .map(kva => {
          let s = kva[0] + '=';
          if (typeof kva[1] === typeof '') {
            s += kva[1]
          } else {
            s += (kva[1] as File).name;
          }
          return s;
        })
        .join('&');
    }
    return info;
  }

}
