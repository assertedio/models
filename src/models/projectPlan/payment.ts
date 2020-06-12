import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

import { ValidatedBase } from 'validated-base';
import { toDate } from '../../utils';
import { Discount, DiscountInterface } from './discount';

export { Discount, DiscountInterface };

export interface PaymentInterface {
  customerId: string;
  delinquent: boolean;
  last4: string | null;
  email: string;
  expiry: string | null;
  lastSyncAt: Date;
}

/**
 * @class
 */
export class Payment extends ValidatedBase implements PaymentInterface {
  /**
   * @param {PaymentInterface} params
   * @param {boolean} validate
   */
  constructor(params: PaymentInterface, validate = true) {
    super();

    this.customerId = params.customerId;
    this.delinquent = params.delinquent;
    this.last4 = params.last4;
    this.email = params.email;
    this.expiry = params.expiry;
    this.lastSyncAt = toDate(params.lastSyncAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  customerId: string;

  @IsBoolean()
  delinquent: boolean;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  expiry: string | null;

  @IsOptional()
  @IsString()
  last4: string | null;

  @IsDate()
  lastSyncAt: Date;
}
