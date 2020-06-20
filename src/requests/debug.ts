import { Allow, IsInstance, IsString } from 'class-validator';

import { ValidatedBase } from 'validated-base';
import { DEPENDENCIES_VERSIONS, Mocha, MochaInterface } from '../models/routineConfig';
import { DependenciesInterface } from './build';
import { validateUpdateRoutineDependencies } from './updateRoutine';

export interface DebugRoutineInterface {
  package: string;
  mocha: MochaInterface;
  dependencies: DEPENDENCIES_VERSIONS | DependenciesInterface;
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
      validateUpdateRoutineDependencies(this.dependencies);
      this.validate();
    }
  }

  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  package: string;

  @Allow()
  dependencies: DEPENDENCIES_VERSIONS | DependenciesInterface;
}
