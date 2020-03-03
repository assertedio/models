import { IsDate, IsInstance, IsInt, IsString, Max, Min } from 'class-validator';
import cuid from 'cuid';
import { DateTime } from 'luxon';

import { Mocha, MochaInterface } from '../models/routine';
import { ValidatedBase } from '../validatedBase';
import { CreateRunInterface as CreateRunRequestInterface } from './createRun';

interface CreateRunInterface extends CreateRunRequestInterface {
  projectId: string;
  mocha: MochaInterface;
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
    this.projectId = params?.projectId;
    this.routineId = params?.routineId;
    this.package = params?.package;
    this.mocha = new Mocha(params?.mocha, false);
    this.timeoutMs = params?.timeoutMs;
    this.createdAt = params?.createdAt;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsString()
  readonly projectId: string;

  @IsString()
  readonly routineId: string;

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