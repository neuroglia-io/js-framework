import { ModelConstructor } from "./model-constructor";

/**
* Holds the result of an erroneous operation
*/
export class OperationError extends ModelConstructor {

  constructor(model?: any) {
    super(model);
  }

  key: string;
  message: string;

}