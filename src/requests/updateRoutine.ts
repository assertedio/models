import { IsInstance, IsInt, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';

import { Interval, IntervalInterface, Mocha, MochaInterface, Routine, RoutineInterface } from '../models';
import { ValidatedBase } from '../validatedBase';

export interface UpdateRoutineInterface extends Omit<RoutineInterface, 'id' | 'projectId'> {
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

    if (validate) {
      this.validate();
    }
  }

  @MaxLength(Routine.CONSTANTS.NAME_MAX_LENGTH)
  @IsString()
  name: string;

  @MaxLength(Routine.CONSTANTS.DESCRIPTION_MAX_LENGTH)
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
  @Max(Routine.CONSTANTS.MAX_TIMEOUT_SEC, { message: Routine.CONSTANTS.MAX_TIMEOUT_ERROR })
  @IsInt()
  timeoutSec: number;

  /**
   * Create instance of update
   * @param {RoutineInterface} routine
   * @param {string} pkg
   * @returns {UpdateRoutine}
   */
  static create(routine: RoutineInterface, pkg: string): UpdateRoutine {
    return new UpdateRoutine({
      ...routine,
      package: pkg,
    });
  }
}
