import { IsBoolean, IsDate, IsInstance, IsOptional, IsString } from 'class-validator';

import { ValidatedBase } from 'validated-base';
import { toDate } from '../utils';
import { RoutineConfig, RoutineConfigInterface } from './routineConfig';

export interface PublicInterface {
  passwordHash: string | null;
}

/**
 * @class
 */
class Public extends ValidatedBase implements PublicInterface {
  /**
   * @param {PublicInterface} params
   * @param {boolean} validate
   */
  constructor(params: PublicInterface, validate = true) {
    super();

    this.passwordHash = params.passwordHash || null;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsString()
  passwordHash: string | null;
}

export interface RoutineInterface extends RoutineConfigInterface {
  hasPackage: boolean;
  enabled: boolean;
  public: PublicInterface | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineConstructorInterface extends Omit<RoutineInterface, 'public'> {
  public?: PublicInterface | null;
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
    this.public = params.public ? new Public(params.public) : null;
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

  @IsOptional()
  @IsInstance(Public)
  public: PublicInterface | null;

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
