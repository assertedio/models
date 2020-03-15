import { Allow, IsEnum, IsInstance, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ValidatedBase } from '../validatedBase';

export enum RUNNERS {
  MOCHA = 'mocha',
}

interface StatsInterface {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  failures: number;
  duration: number;
}

/**
 * @class
 */
export class Stats extends ValidatedBase implements StatsInterface {
  /**
   * @param {StatsInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: StatsInterface, validate = true) {
    super();

    this.duration = params.duration;
    this.failures = params.failures;
    this.passes = params.passes;
    this.pending = params.pending;
    this.suites = params.suites;
    this.tests = params.tests;

    if (validate) {
      this.validate();
    }
  }

  @IsInt()
  duration: number;

  @IsInt()
  failures: number;

  @IsInt()
  passes: number;

  @IsInt()
  pending: number;

  @IsInt()
  suites: number;

  @IsInt()
  tests: number;
}

interface FailureInterface {
  title: string;
  message: string;
  actual: any;
  expected: any;
  stack: string;
  duration: number;
}

/**
 * @class
 */
export class Failure extends ValidatedBase implements FailureInterface {
  /**
   * @param {FailureInterface} params
   * @param {boolean} validate
   */
  constructor(params: FailureInterface, validate = true) {
    super();

    this.actual = params.actual;
    this.expected = params.expected;
    this.message = params.message;
    this.stack = params.stack;
    this.title = params.title;
    this.duration = params.duration;

    if (validate) {
      this.validate();
    }
  }

  @Allow()
  actual: any;

  @Allow()
  expected: any;

  @IsString()
  message: string;

  @IsString()
  stack: string;

  @IsString()
  title: string;

  @IsNumber()
  duration: number;
}

export enum ERROR_TYPE {
  TEST = 'test',
  INTERNAL_ERROR = 'internalError',
  TIMEOUT = 'timeout',
}

export interface SummaryInterface {
  runner: RUNNERS;
  stats: StatsInterface;
  failures: FailureInterface[];
  errorType: ERROR_TYPE | null;
  console: string | null;
}

/**
 * @class
 */
export class Summary extends ValidatedBase implements SummaryInterface {
  /**
   * @param {SummaryInterface} params
   * @param {boolean} validate
   */
  constructor(params: SummaryInterface, validate = true) {
    super();

    this.failures = (params.failures || []).map((failure) => new Failure(failure, false));
    this.runner = params.runner;
    this.stats = new Stats(params.stats, false);
    this.errorType = params.errorType || null;
    this.console = params.console;

    if (validate) {
      this.validate();
    }
  }

  @ValidateNested({ each: true })
  @IsInstance(Failure, { each: true })
  failures: FailureInterface[];

  @IsEnum(RUNNERS)
  runner: RUNNERS;

  @IsInstance(Stats)
  stats: StatsInterface;

  @IsOptional()
  @IsEnum(ERROR_TYPE)
  errorType: ERROR_TYPE | null;

  @IsOptional()
  @IsString()
  console: string | null;
}
