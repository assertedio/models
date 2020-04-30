import { IsInt, IsOptional, Min } from 'class-validator';

import { ValidatedBase } from '../../validatedBase';

export interface LimitsInterface {
  smsCount: number;
  cpuSeconds: number;
}

/**
 * @class
 */
export class Limits extends ValidatedBase implements LimitsInterface {
  /**
   * @param {LimitsInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: LimitsInterface, validate = true) {
    super();

    this.cpuSeconds = params.cpuSeconds;
    this.smsCount = params.smsCount;

    if (validate) {
      this.validate();
    }
  }

  @IsInt()
  @Min(0)
  cpuSeconds: number;

  @IsInt()
  @Min(0)
  smsCount: number;
}

export interface PlanLimitsOverridesInterface {
  smsCount: number | null;
  cpuSeconds: number | null;
}

/**
 * @class
 */
export class PlanLimitsOverrides extends ValidatedBase implements PlanLimitsOverridesInterface {
  /**
   * @param {PlanLimitsOverridesInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: PlanLimitsOverridesInterface, validate = true) {
    super();

    this.cpuSeconds = params.cpuSeconds || null;
    this.smsCount = params.smsCount || null;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsInt()
  @Min(0)
  cpuSeconds: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  smsCount: number | null;
}
