import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';

export interface DiscountInterface {
  amountOff: number | null;
  percentOff: number | null;
  name: string | null;
  id: string;
  start: Date;
  end: Date | null;
}

/**
 * @class
 */
export class Discount extends ValidatedBase implements DiscountInterface {
  /**
   * @param {DiscountInterface} params
   * @param {boolean} validate
   */
  constructor(params: DiscountInterface, validate = true) {
    super();

    this.id = params.id;
    this.name = params.name || null;
    this.amountOff = params.amountOff;
    this.percentOff = params.percentOff;
    this.start = toDate(params.start);
    this.end = params.end ? toDate(params.end) : params.end;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsNumber()
  amountOff: number | null;

  @IsOptional()
  @IsNumber()
  percentOff: number | null;

  @IsDate()
  start: Date;

  @IsOptional()
  @IsDate()
  end: Date | null;
}
