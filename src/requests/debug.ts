import { IsEnum, IsInstance, IsString } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import { DEPENDENCIES_VERSIONS, Mocha, MochaInterface } from '../models/routineConfig';

export interface DebugRoutineInterface {
  package: string;
  mocha: MochaInterface;
  dependencies: DEPENDENCIES_VERSIONS;
}

/**
 * @class
 */
export class Debug extends ValidatedBase implements DebugRoutineInterface {
  /**
   * @param {DebugRoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: DebugRoutineInterface, validate = true) {
    super();

    this.mocha = new Mocha(params.mocha, false);
    this.package = params.package;
    this.dependencies = params.dependencies;

    if (validate) {
      this.validate();
    }
  }

  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  package: string;

  @IsEnum(DEPENDENCIES_VERSIONS, { message: enumError(DEPENDENCIES_VERSIONS) })
  dependencies: DEPENDENCIES_VERSIONS;
}
