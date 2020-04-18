import { IsDate, IsEnum, IsInstance, IsString, ValidateNested } from 'class-validator';

import { BUCKET_WINDOW, BucketStats, BucketStatsConstructorInterface, BucketStatsInterface } from '../models/bucket';
import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface UptimeInterface {
  window: BUCKET_WINDOW;
  tests: BucketStatsInterface;
  runs: BucketStatsInterface;
  routineId: string;
  start: Date;
  end: Date;
}

export interface UptimeConstructorInterface extends Omit<UptimeInterface, 'tests' | 'runs' | 'start' | 'end'> {
  tests: BucketStatsConstructorInterface;
  runs: BucketStatsConstructorInterface;
  start: Date | string;
  end: Date | string;
}

/**
 * @class
 */
export class Uptime extends ValidatedBase implements UptimeInterface {
  /**
   * @param {UptimeConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: UptimeConstructorInterface, validate = true) {
    super();

    this.window = params.window;
    this.routineId = params.routineId;
    this.tests = new BucketStats(params.tests, false);
    this.runs = new BucketStats(params.runs, false);
    this.start = toDate(params.start);
    this.end = toDate(params.end);

    if (validate) {
      this.validate();
    }
  }

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsString()
  routineId: string;

  @IsEnum(BUCKET_WINDOW)
  window: BUCKET_WINDOW;

  @ValidateNested()
  @IsInstance(BucketStats)
  runs: BucketStatsInterface;

  @ValidateNested()
  @IsInstance(BucketStats)
  tests: BucketStatsInterface;
}
