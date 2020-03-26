import { IsDate, IsEnum, IsInstance, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { DateTime } from 'luxon';
import { DeepPartial } from 'ts-essentials';

import { Run, RunInterface } from '../requests/run';
import { Stats, StatsInterface, TestEvent, TestEventInterface } from '../requests/testEvent';
import { ValidatedBase } from '../validatedBase';

export enum RUN_STATUS {
  CREATED = 'created',
  FAILED = 'failed',
  PASSED = 'passed',
}

export enum RUN_FAIL_TYPE {
  TIMEOUT = 'timeout',
  TEST = 'test',
  ERROR = 'error',
}

export enum RUN_TYPE {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
}

interface CreateResultInterface {
  projectId: string;
  runId: string;
  routineId: string;
}

interface ResultInterface extends CreateResultInterface {
  id: string;
  events: TestEventInterface[] | null;
  stats: StatsInterface | null;
  runDurationMs: number | null;
  testDurationMs: number | null;
  type: RUN_TYPE;
  status: RUN_STATUS;
  failType: RUN_FAIL_TYPE | null;
  console: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

const CONSTANTS = {
  ID_PREFIX: 'rs-',
};

/**
 * @class
 */
export class RunRecord extends ValidatedBase implements ResultInterface {
  /**
   * @param {ResultInterface} params
   * @param {boolean} validate
   */
  constructor(params: ResultInterface, validate = true) {
    super();

    this.id = params.id;
    this.projectId = params.projectId;
    this.runId = params.runId;
    this.routineId = params.routineId;
    this.events = params.events ? params.events.map((event) => new TestEvent(event, false)) : null;
    this.stats = params.stats ? new Stats(params.stats, false) : null;
    this.runDurationMs = params.runDurationMs;
    this.testDurationMs = params.testDurationMs;
    this.type = params.type;
    this.console = params.console;
    this.status = params.status;
    this.failType = params.failType;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.completedAt = params.completedAt || null;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsString()
  readonly projectId: string;

  @IsString()
  readonly runId: string;

  @IsString()
  readonly routineId: string;

  @IsEnum(RUN_TYPE)
  readonly type: RUN_TYPE;

  @IsOptional()
  @ValidateNested()
  @IsInstance(TestEvent, { each: true })
  events: TestEventInterface[] | null;

  @IsOptional()
  @ValidateNested()
  @IsInstance(Stats)
  stats: StatsInterface | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  runDurationMs: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  testDurationMs: number | null;

  @IsOptional()
  @IsString()
  console: string | null;

  @IsEnum(RUN_STATUS)
  status: RUN_STATUS;

  @IsOptional()
  @IsEnum(RUN_FAIL_TYPE)
  failType: RUN_FAIL_TYPE | null;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  completedAt: Date | null;

  /**
   * Generate ID for model
   * @param {string} runId
   * @returns {string}
   */
  static generateId(runId: string): string {
    return `${CONSTANTS.ID_PREFIX}${runId.replace(Run.CONSTANTS.ID_PREFIX, '')}`;
  }

  /**
   * Create model instance
   * @param {Run} runRequest
   * @param {RUN_TYPE} type
   * @param {Date} curDate
   * @returns {Result}
   */
  static create(runRequest: RunInterface, type: RUN_TYPE, curDate = DateTime.utc().toJSDate()): RunRecord {
    return new RunRecord({
      projectId: runRequest.projectId,
      runId: runRequest.id,
      routineId: runRequest.routineId,
      type,
      events: null,
      stats: null,
      console: null,
      failType: null,
      status: RUN_STATUS.CREATED,
      id: RunRecord.generateId(runRequest.id),
      runDurationMs: null,
      testDurationMs: null,
      createdAt: curDate,
      updatedAt: curDate,
      completedAt: null,
    });
  }

  /**
   * Get data to be pushed to the db
   * @param {DeepPartial<Result>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<RunRecord>): object {
    return instance;
  }

  /**
   * Stringify object
   * @param {Result} instance
   * @returns {string}
   */
  static stringifyForCache(instance: RunRecord): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {Result}
   */
  static fromJson(object): RunRecord {
    const { createdAt, updatedAt, completedAt, ...rest } = object;
    return new RunRecord({
      ...rest,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
      updatedAt: DateTime.fromISO(updatedAt).toJSDate(),
      completedAt: completedAt ? DateTime.fromISO(completedAt).toJSDate() : null,
    });
  }

  /**
   * Parse from cache
   * @param {string} stringified
   * @returns {Result}
   */
  static parseFromCache(stringified: string): RunRecord {
    return RunRecord.fromJson(JSON.parse(stringified));
  }
}
