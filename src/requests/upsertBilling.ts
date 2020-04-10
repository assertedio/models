import { IsEmail, IsEnum, IsString } from 'class-validator';

import { PLAN_IDS } from '../models/projectPlan';
import { enumError } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface UpsertBillingInterface {
  email: string;
  source: string;
  planId: PLAN_IDS;
}

/**
 * @class
 */
export class UpsertBilling extends ValidatedBase implements UpsertBillingInterface {
  /**
   * @param {UpsertBillingInterface} params
   * @param {boolean} validate
   */
  constructor(params: UpsertBillingInterface, validate = true) {
    super();

    this.email = params.email;
    this.source = params.source;
    this.planId = params.planId;

    if (validate) {
      this.validate();
    }
  }

  @IsEnum(PLAN_IDS, { message: enumError(PLAN_IDS) })
  planId: PLAN_IDS;

  @IsEmail()
  email: string;

  @IsString()
  source: string;
}
