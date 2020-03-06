import { IsBoolean, IsEnum, IsInstance, IsInt, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { isBoolean, isNil } from 'lodash';

import { ValidatedBase } from '../validatedBase';

export enum INTERVAL_UNITS {
  MIN = 'min',
  HR = 'hr',
  DAY = 'day',
}

export interface IntervalInterface {
  value: number;
  unit: INTERVAL_UNITS;
}

const INTERVAL_CONSTANTS = {
  DEFAULT_INTERVAL_VALUE: 5,
  DEFAULT_INTERVAL_UNIT: INTERVAL_UNITS.MIN,
};

/**
 * @class
 */
export class Interval extends ValidatedBase implements IntervalInterface {
  static CONSTANTS = INTERVAL_CONSTANTS;

  /**
   * @param {IntervalInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params?: Partial<IntervalInterface>, validate = true) {
    super();

    this.unit = params?.unit || INTERVAL_CONSTANTS.DEFAULT_INTERVAL_UNIT;
    this.value = isNil(params?.value) ? INTERVAL_CONSTANTS.DEFAULT_INTERVAL_VALUE : (params?.value as number);

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

export interface RoutineInterface {
  id: string;
  projectId: string;
  name: string;
  description: string;
  interval: IntervalInterface;
  prepushLocal: boolean;
  prepushOnce: boolean;
  mocha: MochaInterface;
}

interface CreateRoutineInterface {
  id: string;
  projectId: string;
  name?: string;
  description?: string;
  interval?: IntervalInterface;
  files?: string[];
  ignore?: string[];
  prepushLocal?: boolean;
  prepushOnce?: boolean;
  mocha?: MochaInterface;
}

const ROUTINE_CONSTANTS = {
  NAME_MAX_LENGTH: 30,
  DESCRIPTION_MAX_LENGTH: 100,
};

/**
 * @class
 */
export class Routine extends ValidatedBase implements RoutineInterface {
  static CONSTANTS = ROUTINE_CONSTANTS;

  /**
   * @param {RoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateRoutineInterface, validate = true) {
    super();

    this.id = params?.id;
    this.projectId = params?.projectId;
    this.name = Routine.cleanString(params?.name || '');
    this.description = Routine.cleanString(params?.description || '');
    this.interval = new Interval(params?.interval, false);
    this.prepushLocal = isBoolean(params?.prepushLocal) ? params.prepushLocal : true;
    this.prepushOnce = isBoolean(params?.prepushOnce) ? params.prepushOnce : true;
    this.mocha = new Mocha({ ...params?.mocha }, false);

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

  @IsBoolean()
  prepushOnce: boolean;

  @IsBoolean()
  prepushLocal: boolean;

  @IsString()
  id: string;

  @IsString()
  projectId: string;

  /**
   * Strip unsupported characters
   * @param {string} input
   * @returns {string}
   */
  static cleanString(input: string): string {
    return input.replace(/\s+/g, ' ').trim();
  }
}
