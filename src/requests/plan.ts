import { Allow, IsEnum, IsNumber, IsString, Min } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';

export enum PLAN_INTERVAL {
  MONTH = 'month',
  YEAR = 'year',
}

export enum PLAN_TIERS {
  FREE = 'free',
  STANDARD = 'standard',
  PRO = 'pro',
}

export interface PlanInterface {
  id: string;
  tier: PLAN_TIERS;
  interval: PLAN_INTERVAL;
  name: string;
  price: number;
  currency: string;
  description: string;
  limits: {
    seconds: number;
    sms: number;
    routines: number;
  };
}

export interface ExtraSmsInterface {
  id: string;
  name: string;
  description: string;
  price: number;
  count: number;
}

/**
 * @class
 */
export class Plan extends ValidatedBase implements PlanInterface {
  /**
   * @param {PlanInterface} params
   * @param {boolean} validate
   */
  constructor(params: PlanInterface, validate = true) {
    super();

    this.id = params.id;
    this.interval = params.interval;
    this.name = params.name;
    this.tier = params.tier;
    this.price = params.price;
    this.currency = params.currency;
    this.description = params.description;
    this.limits = params.limits;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsEnum(PLAN_INTERVAL, { message: enumError(PLAN_INTERVAL) })
  interval: PLAN_INTERVAL;

  @IsString()
  name: string;

  @IsEnum(PLAN_TIERS, { message: enumError(PLAN_TIERS) })
  tier: PLAN_TIERS;

  @Min(0)
  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsString()
  description: string;

  @Allow()
  limits: { seconds: number; sms: number; routines: number };
}
