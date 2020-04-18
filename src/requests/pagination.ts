import { IsDate, IsInt, IsOptional, Min } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { DateTime } from 'luxon';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface PaginationInterface {
  start?: Date;
  end?: Date;
  limit?: number;
}

export interface PaginationConstructorInterface {
  start: Date | string;
  end?: Date | string;
  limit?: number;
}

export type CompletePaginationInterface = Required<PaginationInterface>;

/**
 * @class
 */
export class Pagination extends ValidatedBase implements PaginationInterface {
  static CONSTANTS = {
    DEFAULT_LIMIT: 1000,
    DEFAULT_END_UNIT: 'month',
  };

  /**
   * @param {PaginationConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: PaginationConstructorInterface, validate = true) {
    super();

    this.start = params.start ? toDate(params.start) : undefined;
    this.end = params.end ? toDate(params.end) : undefined;
    this.limit = params.limit || undefined;

    if (this.start && this.end && this.start > this.end) {
      throw new Err('if end is provided, start must come before end', HTTP_STATUS.BAD_REQUEST);
    }

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsDate()
  start?: Date;

  @IsOptional()
  @IsDate()
  end?: Date;

  @Min(0)
  @IsInt()
  @IsOptional()
  limit?: number;

  /**
   * Get default values
   * @param {Date} curDate
   * @returns {CompletePaginationInterface}
   */
  static getDefault(curDate = DateTime.utc().toJSDate()): CompletePaginationInterface {
    return {
      limit: 20,
      end: DateTime.fromJSDate(curDate).plus({ day: 1 }).toJSDate(),
      start: DateTime.fromJSDate(curDate).minus({ month: 1 }).toJSDate(),
    };
  }

  /**
   * Get max values
   * @param {Date} curDate
   * @returns {CompletePaginationInterface}
   */
  static getMax(curDate = DateTime.utc().toJSDate()): CompletePaginationInterface {
    return {
      limit: 100,
      end: DateTime.fromJSDate(curDate).plus({ month: 1 }).toJSDate(),
      start: DateTime.fromJSDate(curDate).minus({ year: 1 }).toJSDate(),
    };
  }

  /**
   * Complete pagination request
   * @param {CompletePaginationInterface} max
   * @param {CompletePaginationInterface} defaulValues
   * @returns {CompletePaginationInterface}
   */
  complete(max: CompletePaginationInterface = Pagination.getMax(), defaulValues = Pagination.getDefault()): CompletePaginationInterface {
    if (this.limit && this.limit > max.limit) throw new Err(`max limit is: ${max.limit}`);
    if (this.start && this.start < max.start) throw new Err(`min start is: ${max.start.toISOString()}`);
    if (this.end && this.end > max.end) throw new Err(`max end is: ${max.end.toISOString()}`);

    if (!this.limit) this.limit = defaulValues.limit;
    if (!this.start) this.start = defaulValues.start;
    if (!this.end) this.end = defaulValues.end;

    return this as CompletePaginationInterface;
  }
}
