import { Allow, IsBoolean, IsDate, IsInstance, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { isString } from 'lodash';
import { DateTime } from 'luxon';

import { ValidatedBase } from '../validatedBase';

export interface StatsInterface {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  failures: number;
  start?: Date;
  end?: Date;
  duration?: number;
}

const stringNotDate = (input: Date | string): input is string => {
  return isString(input);
};

const toDate = (input: Date | string): Date => {
  return stringNotDate(input)
    ? DateTime.fromISO(input)
        .toUTC()
        .toJSDate()
    : input;
};

interface StatsConstructorInterface extends Omit<StatsInterface, 'start' | 'end'> {
  start?: Date | string;
  end?: Date | string;
}

/**
 * @class
 */
export class Stats extends ValidatedBase implements StatsInterface {
  /**
   * @param {StatsInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: StatsConstructorInterface, validate = true) {
    super();

    this.suites = params.suites;
    this.tests = params.tests;
    this.passes = params.passes;
    this.pending = params.pending;
    this.failures = params.failures;
    this.start = params.start ? toDate(params.start) : undefined;
    this.end = params.end ? toDate(params.end) : undefined;
    this.duration = params.duration;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsDate()
  end?: Date;

  @IsOptional()
  @IsDate()
  start?: Date;

  @IsNumber()
  failures: number;

  @IsNumber()
  passes: number;

  @IsNumber()
  pending: number;

  @IsNumber()
  suites: number;

  @IsNumber()
  tests: number;
}

export interface TestDataInterface {
  total?: number;
  title?: string;
  fullTitle?: string;
  duration?: number;
  result?: string;
  root?: boolean;
  err?: {
    stack?: string | null;
    message?: string;
    code?: string;
    actual?: any;
    expected?: any;
    operator?: string;
  } | null;
  stats: StatsInterface;
}

export interface TestDataConstructorInterface extends Omit<TestDataInterface, 'stats'> {
  stats: StatsConstructorInterface;
}

/**
 * @class
 */
export class TestData extends ValidatedBase implements TestDataInterface {
  /**
   * @param {TestDataInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: TestDataConstructorInterface, validate = true) {
    super();

    this.duration = params.duration;
    this.err = params.err;
    this.fullTitle = params.fullTitle;
    this.result = params.result;
    this.root = params.root;
    this.stats = new Stats(params.stats, false);
    this.title = params.title;
    this.total = params.total;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @Allow()
  err?: { stack?: string | null; message?: string; code?: string; actual?: any; expected?: any; operator?: string } | null;

  @IsOptional()
  @IsString()
  fullTitle?: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsBoolean()
  root?: boolean;

  @ValidateNested()
  @IsInstance(Stats)
  stats: StatsInterface;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  total?: number;
}

// Should be the same as mocha-ldjson-> TestDataInterface, but don't want to import that whole thing
export interface TestEventInterface {
  type: string;
  data?: TestDataInterface;
  timestamp: Date;
  timeMs: number;
}

export interface TestEventConstructorInterface {
  type: string;
  data?: TestDataConstructorInterface;
  timestamp: Date | string;
  timeMs: number;
}

/**
 * @class
 */
export class TestEvent extends ValidatedBase implements TestEventInterface {
  /**
   * @param {TestEventInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: TestEventConstructorInterface, validate = true) {
    super();

    this.type = params.type;
    this.data = params.data ? new TestData(params.data, false) : undefined;
    this.timestamp = toDate(params.timestamp);
    this.timeMs = params.timeMs;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @ValidateNested()
  @IsInstance(TestData)
  data?: TestDataInterface;

  @IsNumber()
  timeMs: number;

  @IsDate()
  timestamp: Date;

  @IsString()
  type: string;
}
