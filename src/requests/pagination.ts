import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface PaginationInterface {
  start: Date | null;
  end: Date | null;
  limit: number;
}

export interface PaginationConstructorInterface {
  start?: Date | string | number;
  end?: Date | string | number;
  limit?: number;
}

/**
 * @class
 */
export class Pagination extends ValidatedBase implements PaginationInterface {
  static CONSTANTS = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  };

  /**
   * @param {PaginationConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: PaginationConstructorInterface, validate = true) {
    super();

    this.start = params.start ? toDate(params.start) : null;
    this.end = params.end ? toDate(params.end) : null;
    this.limit = params.limit || Pagination.CONSTANTS.DEFAULT_LIMIT;

    if (this.start && this.end) {
      throw new Err('do not provide both start and end for pagination', HTTP_STATUS.BAD_REQUEST);
    }

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsDate()
  start: Date | null;

  @IsOptional()
  @IsDate()
  end: Date | null;

  @Min(0)
  @Max(Pagination.CONSTANTS.MAX_LIMIT)
  @IsInt()
  limit: number;
}
