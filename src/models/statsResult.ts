import { Allow, IsDate, IsEnum, IsInstance, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { DateTime } from 'luxon';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';
import { CompletedRunRecord, CompletedRunRecordConstructorInterface, CompletedRunRecordInterface, RunRecordInterface } from './runRecord';

export enum BUCKET_SIZE {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

/* eslint-disable no-magic-numbers */
export const BUCKET_SIZE_MIN = {
  [BUCKET_SIZE.HOUR]: 60,
  [BUCKET_SIZE.DAY]: 60 * 24,
  [BUCKET_SIZE.WEEK]: 60 * 24 * 7,
  [BUCKET_SIZE.MONTH]: 60 * 24 * 7 * 4,
};
/* eslint-enable no-magic-numbers */

export interface StatsResultInterface {
  start: Date;
  end: Date;
  runs: {
    availability: number;
    passes: number;
    failures: number;
    total: number;
  };
  tests: {
    availability: number;
    passes: number;
    failures: number;
    total: number;
  };
}

interface StatsResultConstructorInterface extends Omit<StatsResultInterface, 'start' | 'end'> {
  start: Date | string;
  end: Date | string;
}

/**
 * @class
 */
export class StatsResult extends ValidatedBase implements StatsResultInterface {
  /**
   * @param {StatsResultConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: StatsResultConstructorInterface, validate = true) {
    super();

    this.start = toDate(params.start);
    this.end = toDate(params.end);
    this.runs = params.runs;
    this.tests = params.tests;

    if (validate) {
      this.validate();
    }
  }

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @Allow()
  runs: { availability: number; passes: number; failures: number; total: number };

  @Allow()
  tests: { availability: number; passes: number; failures: number; total: number };
}

export interface BucketResultInterface {
  start: Date;
  end: Date;
  bucketSize: BUCKET_SIZE;
  overall: StatsResultInterface;
  buckets: StatsResultInterface[];
}

interface BucketResultConstructorInterface extends Omit<BucketResultInterface, 'start' | 'end' | 'overall' | 'buckets'> {
  start: Date | string;
  end: Date | string;
  overall: StatsResultConstructorInterface;
  buckets: StatsResultConstructorInterface[];
}

/**
 * @class
 */
export class BucketResult extends ValidatedBase implements BucketResultInterface {
  /**
   * @param {BucketResultConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: BucketResultConstructorInterface, validate = true) {
    super();

    this.start = toDate(params.start);
    this.end = toDate(params.end);
    this.bucketSize = params.bucketSize;
    this.buckets = params.buckets.map((bucket) => new StatsResult(bucket, false));
    this.overall = new StatsResult(params.overall, false);

    if (validate) {
      this.validate();
    }
  }

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsEnum(BUCKET_SIZE)
  bucketSize: BUCKET_SIZE;

  @ValidateNested({ each: true })
  @IsInstance(StatsResult, { each: true })
  buckets: StatsResultInterface[];

  @ValidateNested()
  @IsInstance(StatsResult)
  overall: StatsResultInterface;
}

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

interface TimelineEventConstructorInterface extends Omit<TimelineEventInterface, 'start' | 'end' | 'durationSec' | 'records'> {
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

  @IsEnum(TIMELINE_EVENT_STATUS)
  status: TIMELINE_EVENT_STATUS;
}

export interface SummaryResultInterface {
  start: Date;
  end: Date;
  latestStatus: TimelineEventInterface | null;
  latestDowntime: TimelineEventInterface | null;
  day: StatsResultInterface;
  week: StatsResultInterface;
  month: StatsResultInterface;
}

interface SummaryResultConstructorInterface {
  start: Date | string;
  end: Date | string;
  latestStatus: TimelineEventConstructorInterface | null;
  latestDowntime: TimelineEventConstructorInterface | null;
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
  @IsInstance(StatsResult)
  month: StatsResultInterface;

  @ValidateNested()
  @IsInstance(StatsResult)
  week: StatsResultInterface;

  @ValidateNested()
  @IsInstance(StatsResult)
  day: StatsResultInterface;
}

export interface StatusResultInterface {
  start: Date;
  end: Date;
  latestStatus: TimelineEventInterface | null;
  records: RunRecordInterface[];
}
