import { IsDate, IsInstance, IsOptional, IsString, ValidateNested } from 'class-validator';

import { toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';
import { Discount, DiscountInterface } from './discount';

export interface SubscriptionInterface {
  nextBillDate: Date | null;
  discount: DiscountInterface | null;
  subscriptionId: string;
  subscriptionItemId: string;
  lastSyncAt: Date;
}

/**
 * @class
 */
export class Subscription extends ValidatedBase implements SubscriptionInterface {
  /**
   * @param {PaymentInterface} params
   * @param {boolean} validate
   */
  constructor(params: SubscriptionInterface, validate = true) {
    super();

    this.subscriptionId = params.subscriptionId;
    this.subscriptionItemId = params.subscriptionItemId;
    this.nextBillDate = params.nextBillDate ? toDate(params.nextBillDate) : params.nextBillDate;
    this.discount = params.discount ? new Discount(params.discount, false) : null;
    this.lastSyncAt = toDate(params.lastSyncAt);

    if (validate) {
      this.validate();
    }
  }

  @ValidateNested()
  @IsInstance(Discount)
  @IsOptional()
  discount: DiscountInterface | null;

  @IsOptional()
  @IsDate()
  nextBillDate: Date | null;

  @IsString()
  subscriptionId: string;

  @IsString()
  subscriptionItemId: string;

  @IsDate()
  lastSyncAt: Date;
}
