import { IsEmail, IsString } from 'class-validator';

import { ValidatedBase } from '../validatedBase';

export interface UpsertBillingInterface {
  email: string;
  source: string;
  planId: string;
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

  @IsString()
  planId: string;

  @IsEmail()
  email: string;

  @IsString()
  source: string;
}
