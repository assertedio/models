import { IsBoolean, IsDate, IsEnum, IsInstance, IsInt, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import { cleanString, toDate } from '../utils';
import {
  DEPENDENCIES_VERSIONS,
  Interval,
  IntervalInterface,
  isDependencyVersion,
  Mocha,
  MochaInterface,
  RoutineConfig,
  RoutineConfigInterface,
} from './routineConfig';

export enum ROUTINE_VISIBILITY {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export interface RoutineInterface extends Omit<RoutineConfigInterface, 'dependencies'> {
  hasPackage: boolean;
  enabled: boolean;
  visibility: ROUTINE_VISIBILITY;
  createdAt: Date;
  updatedAt: Date;
  dependencies: string;
}

export interface RoutineConstructorInterface extends Omit<RoutineInterface, 'visibility'> {
  visibility?: ROUTINE_VISIBILITY;
}

/**
 * @class
 */
export class Routine extends ValidatedBase implements RoutineInterface {
  /**
   * @param {RoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: RoutineConstructorInterface, validate = true) {
    super();

    this.id = params?.id;
    this.projectId = params?.projectId;
    this.name = cleanString(params?.name || '');
    this.description = cleanString(params?.description || '');
    this.interval = new Interval(params?.interval, false);
    this.mocha = new Mocha({ ...params?.mocha }, false);
    this.timeoutSec = params.timeoutSec || RoutineConfig.CONSTANTS.DEFAULT_TIMEOUT_SEC;
    this.dependencies = params.dependencies || RoutineConfig.CONSTANTS.LATEST_DEPENDENCIES_VERSION;

    this.hasPackage = params.hasPackage;
    this.enabled = params.enabled;
    this.visibility = params.visibility || ROUTINE_VISIBILITY.PRIVATE;
    this.createdAt = params.createdAt ? toDate(params.createdAt) : params.createdAt;
    this.updatedAt = params.updatedAt ? toDate(params.updatedAt) : params.updatedAt;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

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
  @Max(RoutineConfig.CONSTANTS.MAX_TIMEOUT_SEC, { message: RoutineConfig.CONSTANTS.MAX_TIMEOUT_ERROR })
  @IsInt()
  timeoutSec: number;

  @ValidateNested()
  @IsInstance(Mocha)
  mocha: MochaInterface;

  @IsString()
  projectId: string;

  @IsString()
  dependencies: string;

  @IsBoolean()
  hasPackage: boolean;

  @IsBoolean()
  enabled: boolean;

  @IsEnum(ROUTINE_VISIBILITY, { message: enumError(ROUTINE_VISIBILITY) })
  visibility: ROUTINE_VISIBILITY;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  /**
   * Routine is active
   *
   * @returns {boolean}
   */
  isActive(): boolean {
    return this.hasPackage && this.enabled;
  }

  /**
   * Convert to simpler config instance
   *
   * @returns {RoutineConfig}
   */
  toRoutineConfig(): RoutineConfig {
    const { dependencies: stringDependencies, ...rest } = this;

    // This is to handle conversion where the dependencies is a dependency build ID
    const dependencies = isDependencyVersion(stringDependencies) ? stringDependencies : DEPENDENCIES_VERSIONS.CUSTOM;

    return new RoutineConfig({ ...rest, dependencies });
  }
}
