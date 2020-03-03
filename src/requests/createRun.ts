import { IsInstance, IsString, ValidateNested } from 'class-validator';

import { Mocha, MochaInterface } from '../models/routine';
import { ValidatedBase } from '../validatedBase';

export interface CreateRunInterface {
  package: string;
  mocha?: MochaInterface;
  routineId: string;
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
    this.routineId = params.routineId;
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

  @IsString()
  routineId: string;
}
