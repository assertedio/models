import { IsInstance, IsOptional, IsString } from 'class-validator';
import { DeepPartial } from 'ts-essentials';

import { Interval, IntervalInterface, Mocha, MochaInterface } from '../models';
import { ValidatedBase } from '../validatedBase';

export interface CreateRoutineInterface {
  name: string;
  description: string;
  interval?: IntervalInterface;
  mocha?: MochaInterface;
}

/**
 * @class
 */
export class CreateRoutine extends ValidatedBase implements CreateRoutineInterface {
  /**
   * @param {CreateRoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: DeepPartial<CreateRoutineInterface>, validate = true) {
    super();

    this.name = params?.name || '';
    this.description = params?.description || '';
    this.interval = params?.interval ? new Interval(params.interval, false) : undefined;
    this.mocha = params?.mocha ? new Mocha(params.mocha, false) : undefined;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInstance(Interval)
  interval?: IntervalInterface;

  @IsOptional()
  @IsInstance(Mocha)
  mocha?: MochaInterface;
}
