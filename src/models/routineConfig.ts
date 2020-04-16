import { IsBoolean, IsEnum, IsInstance, IsInt, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { isNil } from 'lodash';
import { DeepPartial } from 'ts-essentials';

import { cleanString, enumError } from '../utils';
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

  @IsEnum(INTERVAL_UNITS, { message: enumError(INTERVAL_UNITS) })
  unit: INTERVAL_UNITS;

  @IsInt()
  @Min(1)
  value: number;
}

export enum MOCHA_UI {
  BDD = 'bdd',
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

const MOCHA_CONSTANTS = {
  DEFAULT_FILES_GLOB: '**/*.asrtd.js',
};

/**
 * @class
 */
export class Mocha extends ValidatedBase implements MochaInterface {
  static CONSTANTS = MOCHA_CONSTANTS;

  /**
   * @param {Partial<MochaInterface>} params
   * @param {boolean} [validate]
   */
  constructor(params?: Partial<MochaInterface>, validate = true) {
    super();

    this.files = params?.files && !Array.isArray(params?.files) ? [params?.files] : params?.files || [MOCHA_CONSTANTS.DEFAULT_FILES_GLOB];
    this.files = this.files.length === 0 ? [MOCHA_CONSTANTS.DEFAULT_FILES_GLOB] : this.files;
    this.ignore = params?.ignore && !Array.isArray(params?.ignore) ? [params?.ignore] : params?.ignore || [];
    this.bail = params?.bail || false;
    this.ui = params?.ui || MOCHA_UI.BDD;

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

  @IsEnum(MOCHA_UI, { message: enumError(MOCHA_UI) })
  ui: MOCHA_UI;
}

export interface RoutineConfigInterface {
  id: string;
  projectId: string;
  name: string;
  description: string;
  interval: IntervalInterface;
  mocha: MochaInterface;
  timeoutSec: number;
}

export interface RoutineConfigConstructorInterface extends DeepPartial<RoutineConfigInterface> {
  id: string;
  projectId: string;
}

const MAX_TIMEOUT_MIN = 8;
// eslint-disable-next-line no-magic-numbers
const MAX_TIMEOUT_SEC = 60 * MAX_TIMEOUT_MIN;

const ROUTINE_CONSTANTS = {
  NAME_MAX_LENGTH: 30,
  DESCRIPTION_MAX_LENGTH: 100,
  DEFAULT_TIMEOUT_SEC: 1,
  MAX_TIMEOUT_SEC,
  MAX_TIMEOUT_ERROR: `Max timeout is ${MAX_TIMEOUT_MIN} minutes, or ${MAX_TIMEOUT_SEC} seconds`,
};

/**
 * This version can be read/write from disk, does not include ephemeral details
 * @class
 */
export class RoutineConfig extends ValidatedBase implements RoutineConfigInterface {
  static CONSTANTS = ROUTINE_CONSTANTS;

  /**
   * @param {RoutineConfigInterface} params
   * @param {boolean} validate
   */
  constructor(params: RoutineConfigConstructorInterface, validate = true) {
    super();

    this.id = params?.id;
    this.projectId = params?.projectId;
    this.name = cleanString(params?.name || '');
    this.description = cleanString(params?.description || '');
    this.interval = new Interval(params?.interval, false);
    this.mocha = new Mocha({ ...params?.mocha }, false);
    this.timeoutSec = params.timeoutSec || ROUTINE_CONSTANTS.DEFAULT_TIMEOUT_SEC;

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

  @Min(1)
  @Max(ROUTINE_CONSTANTS.MAX_TIMEOUT_SEC, { message: ROUTINE_CONSTANTS.MAX_TIMEOUT_ERROR })
  @IsInt()
  timeoutSec: number;

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  id: string;

  @IsString()
  projectId: string;
}
