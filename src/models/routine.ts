import { IsBoolean, IsDate } from 'class-validator';

import { toDate } from '../utils';
import { RoutineConfig, RoutineConfigInterface } from './routineConfig';

export interface RoutineInterface extends RoutineConfigInterface {
  hasPackage: boolean;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @class
 */
export class Routine extends RoutineConfig {
  /**
   * @param {RoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: RoutineInterface, validate = true) {
    super(params, false);

    this.hasPackage = params.hasPackage;
    this.enabled = params.enabled;
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

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  /**
   * Convert to simpler config instance
   * @returns {RoutineConfig}
   */
  toRoutineConfig(): RoutineConfig {
    return new RoutineConfig(this);
  }
}
