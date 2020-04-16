import { IsDate, IsEnum, IsInstance, IsInt, Min, ValidateNested } from 'class-validator';
import { DateTime } from 'luxon';

import { CompletedRunRecord, CompletedRunRecordConstructorInterface, CompletedRunRecordInterface } from '../models/runRecord';
import { enumError, toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export enum TIMELINE_EVENT_STATUS {
  UP = 'up',
  IMPAIRED = 'impaired',
  DOWN = 'down',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
}

export interface TimelineEventInterface {
  start: Date;
  end: Date;
  durationSec: number;
  records: CompletedRunRecordInterface[];
  status: TIMELINE_EVENT_STATUS;
}

export interface TimelineEventConstructorInterface extends Omit<TimelineEventInterface, 'start' | 'end' | 'durationSec' | 'records'> {
  start: Date | string;
  end: Date | string;
  records: CompletedRunRecordConstructorInterface[];
}

/**
 * @class
 */
export class TimelineEvent extends ValidatedBase implements TimelineEventInterface {
  /**
   * @param {TimelineEventConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: TimelineEventConstructorInterface, validate = true) {
    super();

    this.start = toDate(params.start);
    this.end = toDate(params.end);
    this.durationSec = Math.abs(Math.round(DateTime.fromJSDate(this.end).diff(DateTime.fromJSDate(this.start)).as('seconds')));
    this.status = params.status;
    this.records = params.records.map((record) => new CompletedRunRecord(record, false));

    if (validate) {
      this.validate();
    }
  }

  @IsDate()
  end: Date;

  @IsDate()
  start: Date;

  @Min(0)
  @IsInt()
  durationSec: number;

  @ValidateNested({ each: true })
  @IsInstance(CompletedRunRecord, { each: true })
  records: CompletedRunRecordInterface[];

  @IsEnum(TIMELINE_EVENT_STATUS, { message: enumError(TIMELINE_EVENT_STATUS) })
  status: TIMELINE_EVENT_STATUS;
}
