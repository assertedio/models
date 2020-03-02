import { IsInstance, IsString, ValidateNested } from 'class-validator';

import { Mocha, MochaInterface } from '../models';
import { ValidatedBase } from '../validatedBase';

interface CreateRunInterface {
  package: string;
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

    if (validate) {
      this.validate();
    }
  }

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  package: string;
}