import { IsBoolean, IsEnum, IsInstance, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { isNil } from 'lodash';

import { ValidatedBase } from './validatedBase';

export enum INTERVAL_UNITS {
  MIN = 'min',
  HR = 'hr',
  DAY = 'day',
}

export interface IntervalInterface {
  value: number;
  unit: INTERVAL_UNITS;
}

const CONSTANTS = {
  DEFAULT_INTERVAL_VALUE: 5,
  DEFAULT_INTERVAL_UNIT: INTERVAL_UNITS.MIN,
};

/**
 * @class
 */
export class Interval extends ValidatedBase implements IntervalInterface {
  /**
   * @param {IntervalInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params?: Partial<IntervalInterface>, validate = true) {
    super();

    this.unit = params?.unit || CONSTANTS.DEFAULT_INTERVAL_UNIT;
    this.value = isNil(params?.value) ? CONSTANTS.DEFAULT_INTERVAL_VALUE : (params?.value as number);

    if (validate) {
      this.validate();
    }
  }

  @IsEnum(INTERVAL_UNITS)
  unit: INTERVAL_UNITS;

  @IsInt()
  @Min(1)
  value: number;
}

export enum MOCHA_UI {
  BBD = 'bbd',
  TDD = 'tdd',
  EXPORTS = 'exports',
  QUNIT = 'qunit',
  REQUIRE = 'require',
}

export interface MochaInterface {
  files: string[];
  ignore: string[];
  bail: boolean;
  ui: MOCHA_UI;
}

/**
 * @class
 */
export class Mocha extends ValidatedBase implements MochaInterface {
  /**
   * @param {Partial<MochaInterface>} params
   * @param {boolean} [validate]
   */
  constructor(params?: Partial<MochaInterface>, validate = true) {
    super();

    this.files = params?.files && !Array.isArray(params?.files) ? [params?.files] : params?.files || [];
    this.ignore = params?.ignore && !Array.isArray(params?.ignore) ? [params?.ignore] : params?.ignore || [];
    this.bail = params?.bail || false;
    this.ui = params?.ui || MOCHA_UI.BBD;

    if (validate) {
      this.validate();
    }
  }

  @IsBoolean()
  bail: boolean;

  @IsString({ each: true })
  files: string[];

  @IsString({ each: true })
  ignore: string[];

  @IsEnum(MOCHA_UI)
  ui: MOCHA_UI;
}

export interface RoutineConfigInterface {
  id: string;
  name: string;
  description: string;
  interval: IntervalInterface;
  files: string[];
  ignore: string[];
  prepushLocal: boolean;
  prepushOnce: boolean;
  mocha: MochaInterface;
}

interface CreateRoutineConfigInterface {
  id: string;
  name?: string;
  description?: string;
  interval?: IntervalInterface;
  files?: string[];
  ignore?: string[];
  prepushLocal?: boolean;
  prepushOnce?: boolean;
  mocha?: MochaInterface;
}

/**
 * @class
 */
export class RoutineConfig extends ValidatedBase implements RoutineConfigInterface {
  /**
   * @param {RoutineConfigInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateRoutineConfigInterface, validate = true) {
    super();

    this.id = params?.id;
    this.name = params?.name || '';
    this.description = params?.description || '';
    this.interval = new Interval(params?.interval, false);
    this.files = params?.files && !Array.isArray(params?.files) ? [params?.files] : params?.files || ['**/*.astd.js'];
    this.ignore = params?.ignore && !Array.isArray(params?.ignore) ? [params?.ignore] : params?.ignore || [];
    this.prepushLocal = params?.prepushLocal || true;
    this.prepushOnce = params?.prepushOnce || true;
    this.mocha = new Mocha({ ...params?.mocha, files: params?.mocha?.files || this.files }, false);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  files: string[];

  @IsString({ each: true })
  ignore: string[];

  @ValidateNested()
  @IsInstance(Interval)
  interval: IntervalInterface;

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsBoolean()
  prepushOnce: boolean;

  @IsBoolean()
  prepushLocal: boolean;

  @IsString()
  id: string;
}
