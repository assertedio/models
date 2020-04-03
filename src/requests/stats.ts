import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { DateTime } from 'luxon';

import { CompletedRunRecordInterface, RunRecordInterface, StatsResultInterface } from '../models';
import { BUCKET_SIZE, BucketResultInterface, SummaryResultInterface, TimelineEventInterface } from '../models/statsResult';
import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

interface TimelineStatsConstructorInterface {
  start?: string | Date;
  end?: string | Date;
  routineId: string | null;
}

export interface TimelineStatsInterface extends Omit<TimelineStatsConstructorInterface, 'start' | 'end'> {
  start: Date;
  end: Date;
}

/**
 * @class
 */
export class TimelineStats extends ValidatedBase implements TimelineStatsInterface {
  /**
   * @param {TimelineStatsConstructorInterface} params
   * @param {boolean} validate
   * @param {Date} curDate
   */
  constructor(params: TimelineStatsConstructorInterface, validate = true, curDate = DateTime.utc().toJSDate()) {
    super();

    this.start = params.start ? toDate(params.start) : DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate();
    this.end = params.end ? toDate(params.end) : DateTime.fromJSDate(curDate).toJSDate();
    this.routineId = params.routineId || null;

    if (validate) {
      this.validate();
    }

    if (this.end.valueOf() - this.start.valueOf() <= 0) {
      throw new Err('start must be before end', HTTP_STATUS.BAD_REQUEST);
    }
  }

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsOptional()
  @IsString()
  routineId: string | null;
}

interface SummaryStatsConstructorInterface {
  routineId: string | null;
  end?: string | Date;
}

export interface SummaryStatsInterface extends Omit<SummaryStatsConstructorInterface, 'end'> {
  end: Date;
}

/**
 * @class
 */
export class SummaryStats extends ValidatedBase implements SummaryStatsInterface {
  /**
   * @param {TimelineStatsConstructorInterface} params
   * @param {boolean} validate
   * @param {Date} curDate
   */
  constructor(params: TimelineStatsConstructorInterface, validate = true, curDate = DateTime.utc().toJSDate()) {
    super();

    this.end = params.end ? toDate(params.end) : curDate;
    this.routineId = params.routineId || null;

    if (validate) {
      this.validate();
    }
  }

  @IsDate()
  end: Date;

  @IsOptional()
  @IsString()
  routineId: string | null;
}

interface BucketStatsConstructorInterface extends TimelineStatsConstructorInterface {
  bucketSize?: BUCKET_SIZE;
}

export interface BucketStatsInterface extends Omit<BucketStatsConstructorInterface, 'start' | 'end'> {
  bucketSize: BUCKET_SIZE;
  start: Date;
  end: Date;
}

/**
 * @class
 */
export class BucketStats extends ValidatedBase implements BucketStatsInterface {
  /**
   * @param {BucketStatsConstructorInterface} params
   * @param {boolean} validate
   * @param {Date} curDate
   */
  constructor(params: BucketStatsConstructorInterface, validate = true, curDate = DateTime.utc().toJSDate()) {
    super();

    this.bucketSize = params.bucketSize || BUCKET_SIZE.HOUR;
    this.start = params.start ? toDate(params.start) : DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate();
    this.end = params.end ? toDate(params.end) : DateTime.fromJSDate(curDate).toJSDate();
    this.routineId = params.routineId || null;

    if (validate) {
      this.validate();
    }

    if (this.end.valueOf() - this.start.valueOf() <= 0) {
      throw new Err('start must be before end', HTTP_STATUS.BAD_REQUEST);
    }
  }

  @IsEnum(BUCKET_SIZE)
  bucketSize: BUCKET_SIZE;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsOptional()
  @IsString()
  routineId: string | null;
}

export interface BucketsResponseInterface {
  [k: string]: BucketResultInterface;
}
export interface TimelineResponseInterface {
  [k: string]: TimelineEventInterface[];
}
export interface SummaryResponseInterface {
  [k: string]: SummaryResultInterface;
}

export interface AllResponseInterface {
  buckets: BucketsResponseInterface;
  timeline: TimelineResponseInterface;
  summary: SummaryResponseInterface;
  records: {
    [k: string]: RunRecordInterface[];
  };
}

export interface RoutineStatsInterface {
  latestRecord: CompletedRunRecordInterface | null;
  buckets: StatsResultInterface[];
  timeline: TimelineEventInterface[];
  records: CompletedRunRecordInterface[];
}
