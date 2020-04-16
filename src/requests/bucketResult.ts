import { Allow, IsDate, IsEnum, IsInstance, ValidateNested } from 'class-validator';

import { enumError, toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

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

export interface StatsResultConstructorInterface extends Omit<StatsResultInterface, 'start' | 'end'> {
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

export interface BucketResultConstructorInterface extends Omit<BucketResultInterface, 'start' | 'end' | 'overall' | 'buckets'> {
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

  @IsEnum(BUCKET_SIZE, { message: enumError(BUCKET_SIZE) })
  bucketSize: BUCKET_SIZE;

  @ValidateNested({ each: true })
  @IsInstance(StatsResult, { each: true })
  buckets: StatsResultInterface[];

  @ValidateNested()
  @IsInstance(StatsResult)
  overall: StatsResultInterface;
}
