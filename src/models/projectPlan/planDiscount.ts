import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { DateTime } from 'luxon';

import { toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';

export interface PlanDiscountInterface {
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
export class PlanDiscount extends ValidatedBase implements PlanDiscountInterface {
  /**
   * @param {PlanDiscountInterface} params
   * @param {boolean} validate
   */
  constructor(params: PlanDiscountInterface, validate = true) {
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
   * @param {PlanDiscount} instance
   * @returns {string}
   */
  static stringifyForCache(instance: PlanDiscount): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {PlanDiscount}
   */
  static fromJson(object): PlanDiscount {
    const { start, end, ...rest } = object;
    return new PlanDiscount({
      ...rest,
      start: start ? DateTime.fromISO(start).toJSDate() : undefined,
      end: end ? DateTime.fromISO(end).toJSDate() : undefined,
    });
  }

  /**
   * Parse from cache
   * @param {string} stringified
   * @returns {PlanDiscount}
   */
  static parseFromCache(stringified: string): PlanDiscount {
    return PlanDiscount.fromJson(JSON.parse(stringified));
  }
}
