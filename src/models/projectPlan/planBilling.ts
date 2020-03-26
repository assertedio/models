import { IsBoolean, IsDate, IsInstance, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { DateTime } from 'luxon';

import { ValidatedBase } from '../../validatedBase';
import { PlanDiscount, PlanDiscountInterface } from './planDiscount';

export { PlanDiscount, PlanDiscountInterface };

export interface PlanBillingInterface {
  subscriptionId: string;
  subscriptionItemId: string;
  delinquent: boolean;
  priceCents: number;
  nextBillDate: Date | null;
  last4: string | null;
  email: string | null;
  expiry: string | null;
  discount: PlanDiscountInterface | null;
}

/**
 * @class
 */
export class PlanBilling extends ValidatedBase implements PlanBillingInterface {
  /**
   * @param {PlanBillingInterface} params
   * @param {boolean} validate
   */
  constructor(params: PlanBillingInterface, validate = true) {
    super();

    this.subscriptionId = params.subscriptionId;
    this.subscriptionItemId = params.subscriptionItemId;
    this.delinquent = params.delinquent;
    this.priceCents = params.priceCents;
    this.nextBillDate = params.nextBillDate;
    this.last4 = params.last4;
    this.email = params.email;
    this.expiry = params.expiry;
    this.discount = params.discount ? new PlanDiscount(params.discount, false) : null;

    if (validate) {
      this.validate();
    }
  }

  @IsBoolean()
  delinquent: boolean;

  @Min(0)
  @IsInt()
  priceCents: number;

  @IsInstance(PlanDiscount)
  @IsOptional()
  discount: PlanDiscountInterface | null;

  @IsOptional()
  @IsString()
  email: string | null;

  @IsOptional()
  @IsString()
  expiry: string | null;

  @IsOptional()
  @IsString()
  last4: string | null;

  @IsOptional()
  @IsDate()
  nextBillDate: Date | null;

  @IsString()
  subscriptionId: string;

  @IsString()
  subscriptionItemId: string;

  /**
   * Stringify object
   * @param {PlanBilling} instance
   * @returns {string}
   */
  static stringifyForCache(instance: PlanBilling): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {PlanBilling}
   */
  static fromJson(object): PlanBilling {
    const { nextBillDate, discount, ...rest } = object;
    return new PlanBilling({
      ...rest,
      discount: discount ? PlanDiscount.fromJson(discount) : null,
      nextBillDate: nextBillDate ? DateTime.fromISO(nextBillDate).toJSDate() : null,
    });
  }

  /**
   * Parse from cache
   * @param {string} stringified
   * @returns {PlanBilling}
   */
  static parseFromCache(stringified: string): PlanBilling {
    return PlanBilling.fromJson(JSON.parse(stringified));
  }
}
