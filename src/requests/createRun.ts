import { IsEnum, IsInstance, IsString, ValidateNested } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import { DEPENDENCIES_VERSIONS, Mocha, MochaInterface } from '../models/routineConfig';

export interface CreateRunInterface {
  package: string;
  dependencies: DEPENDENCIES_VERSIONS;
  mocha?: MochaInterface;
}

/**
 * @class
 */
export class CreateRun extends ValidatedBase implements CreateRunInterface {
  /**
   * @param {CreateRunInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: CreateRunInterface, validate = true) {
    super();

    this.package = params.package;
    this.mocha = new Mocha({ ...params?.mocha }, false);
    this.dependencies = params.dependencies;

    if (validate) {
      this.validate();
    }
  }

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  package: string;

  @IsEnum(DEPENDENCIES_VERSIONS, { message: enumError(DEPENDENCIES_VERSIONS) })
  dependencies: DEPENDENCIES_VERSIONS;
}
