import { IsEnum, IsInstance, IsInt, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import {
  DEPENDENCIES_VERSIONS,
  Interval,
  IntervalInterface,
  Mocha,
  MochaInterface,
  RoutineConfig,
  RoutineConfigInterface,
} from '../models/routineConfig';

export interface UpdateRoutineInterface extends Omit<RoutineConfigInterface, 'id' | 'projectId'> {
  package: string;
}

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

  @IsEnum(DEPENDENCIES_VERSIONS, { message: enumError(DEPENDENCIES_VERSIONS) })
  dependencies: DEPENDENCIES_VERSIONS;

  /**
   * Create instance of update
   *
   * @param {RoutineInterface} routine
   * @param {string} pkg
   * @returns {UpdateRoutine}
   */
  static create(routine: RoutineConfigInterface, pkg: string): UpdateRoutine {
    return new UpdateRoutine({
      ...routine,
      package: pkg,
    });
  }
}
