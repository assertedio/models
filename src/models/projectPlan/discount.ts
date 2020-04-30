import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { DateTime } from 'luxon';

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

  /**
   * Stringify object
   * @param {Discount} instance
   * @returns {string}
   */
  static stringifyForCache(instance: Discount): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {Discount}
   */
  static fromJson(object): Discount {
    const { start, end, ...rest } = object;
    return new Discount({
      ...rest,
      start: start ? DateTime.fromISO(start).toJSDate() : undefined,
      end: end ? DateTime.fromISO(end).toJSDate() : undefined,
    });
  }

  /**
   * Parse from cache
   * @param {string} stringified
   * @returns {Discount}
   */
  static parseFromCache(stringified: string): Discount {
    return Discount.fromJson(JSON.parse(stringified));
  }
}
