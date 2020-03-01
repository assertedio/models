import { IsInstance, IsOptional, IsString } from 'class-validator';
import { DeepPartial } from 'ts-essentials';

import { Interval, IntervalInterface, Mocha, MochaInterface, RoutineInterface } from '@/models';

import { ValidatedBase } from '../validatedBase';

type CreateRouteInterface = Omit<DeepPartial<RoutineInterface>, 'id' | 'prepushLocal' | 'prepushOnce'>;

/**
 * @class
 */
export class CreateRoutine extends ValidatedBase implements CreateRouteInterface {
  /**
   * @param {CreateRouteInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateRouteInterface, validate = true) {
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
