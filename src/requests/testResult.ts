import { IsDate, IsInstance, IsString, ValidateNested } from 'class-validator';
import { DateTime } from 'luxon';

import { ValidatedBase } from '../validatedBase';
import { Summary, SummaryInterface } from './summary';

export interface CreateTestResultInterface {
  projectId: string;
  routineId: string;
  runId: string;
  summary: SummaryInterface;
}

export interface TestResultInterface extends CreateTestResultInterface {
  createdAt: Date;
}

/**
 * @class
 */
export class TestResult extends ValidatedBase implements TestResultInterface {
  /**
   * @param {TestResultInterface} params
   * @param {boolean} validate
   */
  constructor(params: TestResultInterface, validate = true) {
    super();

    this.projectId = params.projectId;
    this.routineId = params.routineId;
    this.runId = params.runId;
    this.summary = new Summary(params.summary, false);
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

  @ValidateNested()
  @IsInstance(Summary)
  summary: SummaryInterface;

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
