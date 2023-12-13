import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { ILogger } from '@neuroglia/logging';
import { isObject } from '@neuroglia/common';
import { TargetType } from './models';

@Component({
  selector: 'neuroglia-json-presenter',
  templateUrl: './angular-ui-json-presenter.component.html',
  styleUrls: ['./angular-ui-json-presenter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonPresenterComponent implements OnChanges {
  @Input() json: string | any;
  @Input() isRoot: boolean = true;
  @Input() isFromArray: boolean = false;
  target: any = {};
  TargetType = TargetType;
  type: TargetType = TargetType.Value;
  properties: string[] = [];
  isExpanded: boolean = false;
  asJson: boolean = false;
  private logger: ILogger;

  constructor(private namedLoggingServiceFactory: NamedLoggingServiceFactory) {
    this.logger = this.namedLoggingServiceFactory.create('JsonPresenterComponent');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.json !== typeof '') {
      this.target = this.json;
    } else {
      try {
        this.target = JSON.parse(this.json);
      } catch (ex) {
        //this.logger.warn(`Cannot parse '${this.json}', assuming it's a string and not a JSON serialized object.`);
        this.target = this.json;
      }
    }
    if (isObject(this.target)) {
      this.type = TargetType.Object;
      this.properties = Object.keys(this.target).sort();
    } else if (Array.isArray(this.target)) {
      this.type = TargetType.Array;
    } else if (/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)/.test(this.target)) {
      this.type = TargetType.Date;
    } else {
      this.type = TargetType.Value;
    }
  }

  onToggleJson() {
    this.asJson = !this.asJson;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
