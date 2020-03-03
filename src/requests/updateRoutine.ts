import { IsBoolean, IsInstance, IsString } from 'class-validator';

import { Interval, IntervalInterface, Mocha, MochaInterface, RoutineInterface } from '../models';
import { ValidatedBase } from '../validatedBase';

export interface UpdateRouteInterface extends RoutineInterface {
  package: string;
}

/**
 * @class
 */
export class UpdateRoutine extends ValidatedBase implements UpdateRouteInterface {
  /**
   * @param {CreateRouteInterface} params
   * @param {boolean} validate
   */
  constructor(params: UpdateRouteInterface, validate = true) {
    super();

    this.id = params.id;
    this.name = params?.name || '';
    this.description = params?.description || '';
    this.interval = new Interval(params.interval, false);
    this.mocha = new Mocha(params.mocha, false);
    this.package = params.package;
    this.prepushLocal = params.prepushLocal;
    this.prepushOnce = params.prepushOnce;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsBoolean()
  prepushLocal: boolean;

  @IsBoolean()
  prepushOnce: boolean;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInstance(Interval)
  interval: IntervalInterface;

  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  package: string;

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
