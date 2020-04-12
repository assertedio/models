import { IsDate, IsInstance, IsOptional, ValidateNested } from 'class-validator';

import { CompletedRunRecord, CompletedRunRecordConstructorInterface, CompletedRunRecordInterface } from '../models/runRecord';
import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';
import { StatsResult, StatsResultConstructorInterface, StatsResultInterface } from './bucketResult';
import { TimelineEvent, TimelineEventConstructorInterface, TimelineEventInterface } from './timelineEvent';

export interface SummaryResultInterface {
  start: Date;
  end: Date;
  latestStatus: TimelineEventInterface | null;
  latestDowntime: TimelineEventInterface | null;
  latestRecord: CompletedRunRecordInterface | null;
  day: StatsResultInterface;
  week: StatsResultInterface;
  month: StatsResultInterface;
}

export interface SummaryResultConstructorInterface {
  start: Date | string;
  end: Date | string;
  latestStatus: TimelineEventConstructorInterface | null;
  latestDowntime: TimelineEventConstructorInterface | null;
  latestRecord: CompletedRunRecordConstructorInterface | null;
  day: StatsResultConstructorInterface;
  week: StatsResultConstructorInterface;
  month: StatsResultConstructorInterface;
}

/**
 * @class
 */
export class SummaryResult extends ValidatedBase implements SummaryResultInterface {
  /**
   * @param {SummaryResultConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: SummaryResultConstructorInterface, validate = true) {
    super();

    this.start = toDate(params.start);
    this.end = toDate(params.end);
    this.latestDowntime = params.latestDowntime ? new TimelineEvent(params.latestDowntime, false) : null;
    this.latestStatus = params.latestStatus ? new TimelineEvent(params.latestStatus, false) : null;
    this.latestRecord = params.latestRecord ? new CompletedRunRecord(params.latestRecord, false) : null;
    this.month = new StatsResult(params.month, false);
    this.week = new StatsResult(params.week, false);
    this.day = new StatsResult(params.day, false);

    if (validate) {
      this.validate();
    }
  }

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @ValidateNested()
  @IsOptional()
  @IsInstance(TimelineEvent)
  latestDowntime: TimelineEventInterface | null;

  @ValidateNested()
  @IsOptional()
  @IsInstance(TimelineEvent)
  latestStatus: TimelineEventInterface | null;

  @ValidateNested()
  @IsOptional()
  @IsInstance(CompletedRunRecord)
  latestRecord: CompletedRunRecordInterface | null;

  @ValidateNested()
  @IsInstance(StatsResult)
  month: StatsResultInterface;

  @ValidateNested()
  @IsInstance(StatsResult)
  week: StatsResultInterface;

  @ValidateNested()
  @IsInstance(StatsResult)
  day: StatsResultInterface;
}
