import { IsDate, IsEnum, IsInstance, IsInt, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';

import { ValidatedBase } from 'validated-base';
import { toDate } from '../utils';
import { CompletedRunRecordInterface, RUN_STATUS } from './runRecord';

export enum BUCKET_SIZE {
  MIN_5 = 'min5',
  HOUR = 'hour',
  HOUR_6 = 'hour6',
  DAY = 'day',
}

export enum BUCKET_WINDOW {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  MONTH_3 = 'month3',
}

export const DEFAULT_BUCKET_WINDOW_TO_SIZE = {
  [BUCKET_WINDOW.DAY]: BUCKET_SIZE.MIN_5, // 24 * 12 = 288
  [BUCKET_WINDOW.WEEK]: BUCKET_SIZE.HOUR, // 7 * 24 = 168
  [BUCKET_WINDOW.MONTH]: BUCKET_SIZE.HOUR, // 30 * 24 = 720
  [BUCKET_WINDOW.MONTH_3]: BUCKET_SIZE.HOUR_6, // 3 * 30 * 4 = 360
};

export interface BucketStatsInterface {
  availability: number;
  failures: number;
  passes: number;
  total: number;
}

export type BucketStatsConstructorInterface = Omit<BucketStatsInterface, 'availability' | 'total'>;

/**
 * @class
 */
export class BucketStats extends ValidatedBase implements BucketStatsInterface {
  /**
   * @param {BucketStatsInterface} params
   * @param {boolean} validate
   */
  constructor(params: BucketStatsConstructorInterface, validate = true) {
    super();

    this.failures = params.failures;
    this.passes = params.passes;
    this.total = this.failures + this.passes;
    this.availability = this.total > 0 ? params.passes / this.total : 0;

    if (validate) {
      this.validate();
    }
  }

  @Min(0)
  @IsNumber()
  availability: number;

  @Min(0)
  @IsInt()
  failures: number;

  @Min(0)
  @IsInt()
  passes: number;

  @Min(0)
  @IsInt()
  total: number;
}

export interface BucketInterface {
  id: string;
  size: BUCKET_SIZE;
  tests: BucketStatsInterface;
  runs: BucketStatsInterface;
  routineId: string;
  projectId: string;
  start: Date;
  end: Date;
}

export interface BucketConstructorInterface extends Omit<BucketInterface, 'tests' | 'runs' | 'start' | 'end' | 'id'> {
  tests: BucketStatsConstructorInterface;
  runs: BucketStatsConstructorInterface;
  start: Date | string;
  end: Date | string;
}

/**
 * @class
 */
export class Bucket extends ValidatedBase implements BucketInterface {
  static CONSTANTS = {
    ID_PREFIX: 'bk-',
  };

  /**
   * @param {BucketConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: BucketConstructorInterface, validate = true) {
    super();

    this.size = params.size;
    this.projectId = params.projectId;
    this.routineId = params.routineId;
    this.tests = new BucketStats(params.tests, false);
    this.runs = new BucketStats(params.runs, false);
    this.start = toDate(params.start);
    this.end = toDate(params.end);

    this.id = Bucket.generateId(this.routineId, this.size, this.end);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsEnum(BUCKET_SIZE)
  size: BUCKET_SIZE;

  @IsString()
  routineId: string;

  @IsString()
  projectId: string;

  @ValidateNested()
  @IsInstance(BucketStats)
  runs: BucketStatsInterface;

  @ValidateNested()
  @IsInstance(BucketStats)
  tests: BucketStatsInterface;

  /**
   * Get id of bucket
   *
   * @param {string} routineId
   * @param {BUCKET_SIZE} size
   * @param {Date} completedAt
   * @returns {DateTime}
   */
  static generateId(routineId: string, size: BUCKET_SIZE, completedAt: Date): string {
    const bucktedDatetime = Bucket.getStart(size, completedAt);
    return Bucket.CONSTANTS.ID_PREFIX + shorthash.unique(`${routineId}${size}${bucktedDatetime.toUTC().toISO()}`);
  }

  /**
   * Get start date of bucket
   *
   * @param {BUCKET_SIZE} size
   * @param {Date} date
   * @returns {DateTime}
   */
  static getStart(size: BUCKET_SIZE, date: Date): DateTime {
    const dateTime = DateTime.fromJSDate(date).toUTC();

    switch (size) {
      case BUCKET_SIZE.MIN_5: {
        // eslint-disable-next-line no-magic-numbers
        const minute = Math.floor(dateTime.minute / 5) * 5;
        return dateTime.set({ minute, second: 0, millisecond: 0 });
      }
      case BUCKET_SIZE.HOUR_6: {
        // eslint-disable-next-line no-magic-numbers
        const hour = Math.floor(dateTime.hour / 6) * 6;
        return dateTime.set({ hour, minute: 0, second: 0, millisecond: 0 });
      }
      default: {
        return dateTime.startOf(size);
      }
    }
  }

  /**
   * Get end date of bucket
   *
   * @param {BUCKET_SIZE} size
   * @param {Date} date
   * @returns {DateTime}
   */
  static getEnd(size: BUCKET_SIZE, date: Date): DateTime {
    const dateTime = DateTime.fromJSDate(date).toUTC();

    switch (size) {
      case BUCKET_SIZE.MIN_5: {
        // eslint-disable-next-line no-magic-numbers
        const minute = (Math.floor(dateTime.minute / 5) + 1) * 5;
        return dateTime.set({ minute, second: 0, millisecond: 0 }).minus({ second: 5 }).endOf('minute');
      }
      case BUCKET_SIZE.HOUR_6: {
        // eslint-disable-next-line no-magic-numbers
        const hour = (Math.floor(dateTime.hour / 6) + 1) * 6;
        return dateTime.set({ hour, minute: 0, second: 0, millisecond: 0 }).minus({ minute: 5 }).endOf('hour');
      }
      default: {
        return dateTime.endOf(size);
      }
    }
  }

  /**
   * Create bucket for completed run record
   *
   * @param {CompletedRunRecordInterface} completedRunRecord
   * @param {BUCKET_SIZE} size
   * @returns {Bucket}
   */
  static create(completedRunRecord: CompletedRunRecordInterface, size: BUCKET_SIZE): Bucket {
    const { completedAt, projectId, routineId, status, stats } = completedRunRecord;

    return new Bucket({
      size,
      projectId,
      routineId,
      start: Bucket.getStart(size, completedAt).toJSDate(),
      end: Bucket.getEnd(size, completedAt).toJSDate(),
      runs: {
        failures: status === RUN_STATUS.FAILED ? 1 : 0,
        passes: status === RUN_STATUS.PASSED ? 1 : 0,
      },
      tests: {
        failures: stats?.failures || 0,
        passes: stats?.passes || 0,
      },
    });
  }
}
