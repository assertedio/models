import { IsBoolean, IsDate, IsEnum, IsInstance, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { isNumber } from 'lodash';

import { enumError, ValidatedBase } from 'validated-base';
import { toDate } from '../utils';

// Should map directly to: RunnerConstants in Mocha
export enum TEST_EVENT_TYPES {
  EVENT_HOOK_BEGIN = 'hook',
  EVENT_HOOK_END = 'hook end',
  EVENT_RUN_BEGIN = 'start',
  EVENT_DELAY_BEGIN = 'waiting',
  EVENT_DELAY_END = 'ready',
  EVENT_RUN_END = 'end',
  EVENT_SUITE_BEGIN = 'suite',
  EVENT_SUITE_END = 'suite end',
  EVENT_TEST_BEGIN = 'test',
  EVENT_TEST_END = 'test end',
  EVENT_TEST_FAIL = 'fail',
  EVENT_TEST_PASS = 'pass',
  EVENT_TEST_PENDING = 'pending',
  EVENT_TEST_RETRY = 'retry',
}

export interface TestStatsInterface {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  incomplete: number;
  failures: number;
  start?: Date;
  end?: Date;
  duration: number | null;
}

export interface TestStatsConstructorInterface extends Omit<TestStatsInterface, 'start' | 'end'> {
  start?: Date | string;
  end?: Date | string;
}

/**
 * @class
 */
export class TestStats extends ValidatedBase implements TestStatsInterface {
  /**
   * @param {TestStatsInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: TestStatsConstructorInterface, validate = true) {
    super();

    this.suites = params.suites || 0;
    this.tests = params.tests || 0;
    this.passes = params.passes || 0;
    this.pending = params.pending || 0;
    this.failures = params.failures || 0;
    this.incomplete = params.incomplete || 0;
    this.start = params.start ? toDate(params.start) : undefined;
    this.end = params.end ? toDate(params.end) : undefined;
    this.duration = isNumber(params.duration) ? params.duration : null;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsNumber()
  duration: number | null;

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
  incomplete: number;

  @IsNumber()
  suites: number;

  @IsNumber()
  tests: number;
}

export interface TestErrorInterface {
  fullTitle?: string;
  stack?: string | null;
  message?: string;
  diff?: string;
  code?: string | number;
}

/**
 * @class
 */
export class TestError extends ValidatedBase implements TestErrorInterface {
  /**
   * @param {TestErrorInterface} params
   * @param {boolean} validate
   */
  constructor(params: TestErrorInterface, validate = true) {
    super();

    this.fullTitle = params.fullTitle;
    this.stack = params.stack || null;
    this.message = params.message;
    this.diff = params.diff;
    this.code = params.code;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsString()
  fullTitle?: string;

  @IsOptional()
  @IsString()
  stack?: string | null;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  diff?: string;

  @IsOptional()
  @IsString()
  code?: string | number;
}

export enum TEST_RESULT_STATUS {
  PASSED = 'passed',
  FAILED = 'failed',
  PENDING = 'pending',
  INCOMPLETE = 'incomplete',
}

export interface TestDataInterface {
  id: string | null;
  type: TEST_EVENT_TYPES;
  title: string | null;
  fullTitle: string | null;
  fullTitlePath: string[];
  duration: number | null;
  result: TEST_RESULT_STATUS | null;
  root: boolean;
  file: string | null;
  error: TestErrorInterface | null;
  timedOut: boolean;
}

/**
 * @class
 */
export class TestData extends ValidatedBase implements TestDataInterface {
  /**
   * @param {TestDataInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: TestDataInterface, validate = true) {
    super();

    this.id = params.id || null;
    this.type = params.type;
    this.duration = isNumber(params.duration) ? params.duration : null;
    this.title = params.title || null;
    this.fullTitle = params.fullTitle || null;
    this.fullTitlePath = params.fullTitlePath || [];
    this.result = params.result || null;
    this.root = params.root || false;
    this.file = params.file || null;
    this.error = params.error ? new TestError(params.error, false) : null;
    this.timedOut = params.timedOut || false;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsString()
  id: string | null;

  @IsEnum(TEST_EVENT_TYPES, { message: enumError(TEST_EVENT_TYPES) })
  type: TEST_EVENT_TYPES;

  @IsOptional()
  @IsString()
  title: string | null;

  @IsOptional()
  @IsString()
  fullTitle: string | null;

  @IsString({ each: true })
  fullTitlePath: string[];

  @IsOptional()
  @IsNumber()
  duration: number | null;

  @IsOptional()
  @IsEnum(TEST_RESULT_STATUS, { message: enumError(TEST_RESULT_STATUS) })
  result: TEST_RESULT_STATUS | null;

  @IsBoolean()
  root: boolean;

  @IsOptional()
  @IsString()
  file: string | null;

  @ValidateNested()
  @IsOptional()
  @IsInstance(TestError)
  error: TestErrorInterface | null;

  @IsBoolean()
  timedOut: boolean;
}

// Should be the same as mocha-ldjson-> TestDataInterface, but don't want to import that whole thing
export interface TestEventInterface {
  data: TestDataInterface;
  stats: TestStatsInterface;
  timestamp: Date;
  elapsedMs: number;
}

export interface TestEventConstructorInterface extends Omit<TestEventInterface, 'timestamp' | 'stats'> {
  stats: TestStatsConstructorInterface;
  timestamp: Date | string;
}

/**
 * @class
 */
export class TestEvent extends ValidatedBase implements TestEventInterface {
  /**
   * @param {TestEventInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: TestEventConstructorInterface, validate = true) {
    super();

    this.data = new TestData(params.data, false);
    this.stats = new TestStats(params.stats, false);
    this.timestamp = toDate(params.timestamp);
    this.elapsedMs = params.elapsedMs;

    if (validate) {
      this.validate();
    }
  }

  @ValidateNested()
  @IsInstance(TestData)
  data: TestDataInterface;

  @ValidateNested()
  @IsInstance(TestStats)
  stats: TestStatsInterface;

  @IsNumber()
  elapsedMs: number;

  @IsDate()
  timestamp: Date;
}
