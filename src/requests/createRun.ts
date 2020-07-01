import { IsInstance, IsString, ValidateNested } from 'class-validator';

import { ValidatedBase } from 'validated-base';
import { Mocha, MochaConstructorInterface, MochaInterface } from '../models/routineConfig';

export interface CreateRunInterface {
  package: string;
  dependencies: string;
  mocha?: MochaInterface;
}

export interface CreateRunConstructorInterface extends Omit<CreateRunInterface, 'mocha'> {
  mocha?: MochaConstructorInterface;
}

/**
 * @class
 */
export class CreateRun extends ValidatedBase implements CreateRunInterface {
  /**
   * @param {CreateRunInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: CreateRunConstructorInterface, validate = true) {
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

  @IsString()
  dependencies: string;
}
