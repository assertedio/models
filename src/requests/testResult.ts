import { IsDate, IsEnum, IsInstance, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { DateTime } from 'luxon';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';
import { RUN_TYPE } from './run';
import { TestEvent, TestEventConstructorInterface, TestEventInterface } from './testEvent';

export enum RUN_TIMEOUT_TYPE {
  JOB = 'job',
  EXEC = 'exec',
  REPORTER = 'reporter',
  UNKNOWN = 'unknown',
}

export interface CreateTestResultInterface {
  runId: string;
  console: string | null;
  type: RUN_TYPE;
  runDurationMs: number;
  events: TestEventInterface[];
  timeoutType: RUN_TIMEOUT_TYPE | null;
}

export interface TestResultInterface extends Omit<CreateTestResultInterface, 'events'> {
  createdAt: Date;
  events: TestEventInterface[];
}

interface TestResultConstructorInterface extends Omit<TestResultInterface, 'events' | 'createdAt'> {
  createdAt: Date | string;
  events: TestEventConstructorInterface[];
}

/**
 * @class
 */
export class TestResult extends ValidatedBase implements TestResultInterface {
  /**
   * @param {TestResultInterface} params
   * @param {boolean} validate
   */
  constructor(params: TestResultConstructorInterface, validate = true) {
    super();

    this.runId = params.runId;
    this.type = params.type;
    this.console = params.console;
    this.runDurationMs = params.runDurationMs;
    this.events = (params.events || []).map((event) => new TestEvent(event, false));
    this.timeoutType = params.timeoutType || null;
    this.createdAt = toDate(params.createdAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  runId: string;

  @IsEnum(RUN_TYPE)
  type: RUN_TYPE;

  @IsOptional()
  @IsString()
  console: string | null;

  @Min(0)
  @IsInt()
  runDurationMs: number;

  @ValidateNested({ each: true })
  @IsInstance(TestEvent, { each: true })
  events: TestEventInterface[];

  @IsOptional()
  @IsEnum(RUN_TIMEOUT_TYPE)
  timeoutType: RUN_TIMEOUT_TYPE | null;

  @IsDate()
  createdAt: Date;

  /**
   * Create instance of class
   * @param {CreateTestResultInterface} params
   * @param {Date} curDate
   * @returns {TestResult}
   */
  static create(params: Omit<TestResultConstructorInterface, 'createdAt'>, curDate = DateTime.utc().toJSDate()): TestResult {
    return new TestResult({
      ...params,
      createdAt: curDate,
    });
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {TestResult}
   */
  static fromJson(object): TestResult {
    const { createdAt, ...rest } = object;
    return new TestResult({
      ...rest,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
    });
  }
}
