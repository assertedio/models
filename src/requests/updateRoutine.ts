import { Allow, isEnum, IsInstance, IsInt, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';

import { ValidatedBase } from 'validated-base';
import {
  DEPENDENCIES_VERSIONS,
  Interval,
  IntervalInterface,
  Mocha,
  MochaInterface,
  RoutineConfig,
  RoutineConfigInterface,
} from '../models/routineConfig';
import { DependenciesInterface, isDependenciesObject } from './build';

export interface UpdateRoutineInterface extends Omit<RoutineConfigInterface, 'id' | 'projectId' | 'dependencies'> {
  package: string;
  dependencies: DEPENDENCIES_VERSIONS | DependenciesInterface;
}

export const validateUpdateRoutineDependencies = (input: any): void => {
  if (!isEnum(input, DEPENDENCIES_VERSIONS) && !isDependenciesObject(input)) {
    throw new Err('dependencies must be an enum or an object containing at least the packageJson', HTTP_STATUS.BAD_REQUEST);
  }

  if (input === DEPENDENCIES_VERSIONS.CUSTOM) {
    throw new Err('custom dependencies are specified as object', HTTP_STATUS.BAD_REQUEST);
  }
};

/**
 * @class
 */
export class UpdateRoutine extends ValidatedBase implements UpdateRoutineInterface {
  /**
   * @param {UpdateRoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: UpdateRoutineInterface, validate = true) {
    super();

    this.name = params?.name || '';
    this.description = params?.description || '';
    this.interval = new Interval(params.interval, false);
    this.mocha = new Mocha(params.mocha, false);
    this.package = params.package;
    this.timeoutSec = params.timeoutSec;
    this.dependencies = params.dependencies;

    if (validate) {
      validateUpdateRoutineDependencies(this.dependencies);
      this.validate();
    }
  }

  @MaxLength(RoutineConfig.CONSTANTS.NAME_MAX_LENGTH)
  @IsString()
  name: string;

  @MaxLength(RoutineConfig.CONSTANTS.DESCRIPTION_MAX_LENGTH)
  @IsString()
  description: string;

  @ValidateNested()
  @IsInstance(Interval)
  interval: IntervalInterface;

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  package: string;

  @Min(1)
  @Max(RoutineConfig.CONSTANTS.MAX_TIMEOUT_SEC, { message: RoutineConfig.CONSTANTS.MAX_TIMEOUT_ERROR })
  @IsInt()
  timeoutSec: number;

  @Allow()
  dependencies: DEPENDENCIES_VERSIONS | DependenciesInterface;

  /**
   * Create instance of update
   *
   * @param {RoutineInterface} routine
   * @param {string} pkg
   * @param {DEPENDENCIES_VERSIONS | DependenciesInterface} dependencies
   * @returns {UpdateRoutine}
   */
  static create(
    routine: Omit<RoutineConfigInterface, 'dependencies' | 'id'>,
    pkg: string,
    dependencies: DEPENDENCIES_VERSIONS | DependenciesInterface
  ): UpdateRoutine {
    return new UpdateRoutine({
      ...routine,
      dependencies,
      package: pkg,
    });
  }
}
