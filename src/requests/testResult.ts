import { IsDate, IsInstance, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DateTime } from 'luxon';

import { ValidatedBase } from '../validatedBase';
import { TestEvent, TestEventConstructorInterface, TestEventInterface } from './testEvent';

export interface CreateTestResultInterface {
  projectId: string;
  routineId: string;
  runId: string;
  console: string | null;
  events: TestEventInterface[];
}

export interface TestResultInterface extends CreateTestResultInterface {
  createdAt: Date;
}

interface TestResultConstructorInterface extends Omit<TestResultInterface, 'events'> {
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

    this.projectId = params.projectId;
    this.routineId = params.routineId;
    this.runId = params.runId;
    this.console = params.console;
    this.events = (params.events || []).map((event) => new TestEvent(event, false));
    this.createdAt = params.createdAt;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  projectId: string;

  @IsString()
  routineId: string;

  @IsString()
  runId: string;

  @IsOptional()
  @IsString()
  console: string | null;

  @ValidateNested({ each: true })
  @IsInstance(TestEvent, { each: true })
  events: TestEventInterface[];

  @IsDate()
  createdAt: Date;

  /**
   * Create instance of class
   * @param {CreateTestResultInterface} params
   * @param {Date} curDate
   * @returns {TestResult}
   */
  static create(params: CreateTestResultInterface, curDate = DateTime.utc().toJSDate()): TestResult {
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
