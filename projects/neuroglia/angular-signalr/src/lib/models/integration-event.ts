import { ModelConstructor } from '@neuroglia/common';
import { IIntegrationEvent } from './integration-event.interface';

export abstract class IntegrationEvent extends ModelConstructor implements IIntegrationEvent{

  constructor(model?: any) {
    super(model);
  }

  aggregateId: string;
  createdAt: string | Date;
  type: string;
  
}