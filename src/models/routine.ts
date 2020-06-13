import { IsBoolean, IsDate, IsEnum } from 'class-validator';

import { enumError } from 'validated-base';
import { toDate } from '../utils';
import { RoutineConfig, RoutineConfigInterface } from './routineConfig';

export enum ROUTINE_VISIBILITY {
  PRIVATE = 'private',
  PUBLIC = 'public',
  PROTECTED = 'protected',
}

export interface RoutineInterface extends RoutineConfigInterface {
  hasPackage: boolean;
  enabled: boolean;
  visibility: ROUTINE_VISIBILITY;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineConstructorInterface extends Omit<RoutineInterface, 'visibility'> {
  visibility?: ROUTINE_VISIBILITY;
}

/**
 * @class
 */
export class Routine extends RoutineConfig implements RoutineInterface {
  /**
   * @param {RoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: RoutineConstructorInterface, validate = true) {
    super(params, false);

    this.hasPackage = params.hasPackage;
    this.enabled = params.enabled;
    this.visibility = params.visibility || ROUTINE_VISIBILITY.PRIVATE;
    this.createdAt = params.createdAt ? toDate(params.createdAt) : params.createdAt;
    this.updatedAt = params.updatedAt ? toDate(params.updatedAt) : params.updatedAt;

    if (validate) {
      this.validate();
    }
  }

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
    return new RoutineConfig(this);
  }
}
