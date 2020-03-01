import { IsDate, IsInstance, IsInt, IsString, Max, Min, ValidateNested } from 'class-validator';

import { ValidatedBase } from '../validatedBase';
import { Mocha, MochaInterface } from './routine';

interface CreateRunInterface {
  package: string;
  timeoutMs: number;
  mocha: MochaInterface;
}

interface RunInterface extends CreateRunInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const MIN_TIMEOUT_MS = 0;
// eslint-disable-next-line no-magic-numbers
export const MAX_TIMEOUT_MS = 1000 * 60 * 9;

/**
 * @class
 */
export class Run extends ValidatedBase implements RunInterface {
  /**
   * @param {RunInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: RunInterface, validate = true) {
    super();

    this.id = params.id;
    this.package = params.package;
    this.timeoutMs = params.timeoutMs;
    this.mocha = new Mocha(params.mocha, false);
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsString()
  package: string;

  @Min(MIN_TIMEOUT_MS)
  @Max(MAX_TIMEOUT_MS)
  @IsInt()
  timeoutMs: number;

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
