import { IsDate, IsEnum, IsInstance, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';
import cuid from 'cuid';
import { DateTime } from 'luxon';

import { Mocha, MochaInterface } from '../models/routineConfig';
import { enumError, toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';
import { CreateRunInterface as CreateRunRequestInterface } from './createRun';

export enum RUN_TYPE {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
}

interface CreateRunInterface extends CreateRunRequestInterface {
  mocha: MochaInterface;
  type: RUN_TYPE;
  timeoutMs: number;
}

export interface RunInterface extends CreateRunInterface {
  id: string;
  createdAt: Date;
}

const CONSTANTS = {
  ID_PREFIX: 'rn-',
  MIN_TIMEOUT_MS: 100,
  // eslint-disable-next-line no-magic-numbers
  MAX_TIMEOUT_MS: 1000 * 60 * 9,
};

/**
 * @class
 */
export class Run extends ValidatedBase implements RunInterface {
  static CONSTANTS = CONSTANTS;

  /**
   * @param {RunInterface} params
   * @param {boolean} validate
   */
  constructor(params: RunInterface, validate = true) {
    super();

    this.id = params.id;
    this.type = params.type;
    this.package = params?.package;
    this.mocha = new Mocha(params?.mocha, false);
    this.timeoutMs = params?.timeoutMs;

    // This is necessary to convert the string-version as it comes in as JSON
    // The alternative is to create a dedicated fromJSON method, that I don't care to do right now
    this.createdAt = toDate(params?.createdAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsEnum(RUN_TYPE, { message: enumError(RUN_TYPE) })
  readonly type: RUN_TYPE;

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  package: string;

  @Min(CONSTANTS.MIN_TIMEOUT_MS)
  @Max(CONSTANTS.MAX_TIMEOUT_MS)
  @IsInt()
  timeoutMs: number;

  @IsDate()
  readonly createdAt: Date;

  /**
   * Generate ID for model
   * @returns {string}
   */
  static generateId(): string {
    return `${CONSTANTS.ID_PREFIX}${cuid()}`;
  }

  /**
   * Create model instance
   * @param {CreateRunInterface} params
   * @param {Date} curDate=now
   * @returns {Run}
   */
  static create(params: CreateRunInterface, curDate = DateTime.utc().toJSDate()): Run {
    return new Run({
      ...params,
      id: Run.generateId(),
      createdAt: curDate,
    });
  }
}
