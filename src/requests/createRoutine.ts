import { IsInstance, IsOptional, IsString, MaxLength } from 'class-validator';
import { DeepPartial } from 'ts-essentials';

import { Interval, IntervalInterface, Mocha, MochaInterface, Routine } from '../models';
import { ValidatedBase } from '../validatedBase';

export interface CreateRoutineInterface {
  name: string;
  description: string;
  projectId: string;
  interval?: IntervalInterface;
  mocha?: MochaInterface;
}

export interface CreateRoutineConstructorInterface extends DeepPartial<CreateRoutineInterface> {
  projectId: string;
}

/**
 * @class
 */
export class CreateRoutine extends ValidatedBase implements CreateRoutineInterface {
  /**
   * @param {CreateRoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateRoutineConstructorInterface, validate = true) {
    super();

    this.projectId = params?.projectId;
    this.name = Routine.cleanString(params?.name || '');
    this.description = Routine.cleanString(params?.description || '');
    this.interval = params?.interval ? new Interval(params.interval, false) : undefined;
    this.mocha = params?.mocha ? new Mocha(params.mocha, false) : undefined;

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

  @IsString()
  projectId: string;

  @IsOptional()
  @IsInstance(Interval)
  interval?: IntervalInterface;

  @IsOptional()
  @IsInstance(Mocha)
  mocha?: MochaInterface;
}
