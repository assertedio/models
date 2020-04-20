import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface PaginationInterface {
  before: Date | null;
  after: Date | null;
  limit: number;
}

export interface PaginationConstructorInterface {
  before?: Date | string | number;
  after?: Date | string | number;
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

    this.before = params.before ? toDate(params.before) : null;
    this.after = params.after ? toDate(params.after) : null;
    this.limit = params.limit || Pagination.CONSTANTS.DEFAULT_LIMIT;

    if (this.before && this.after) {
      throw new Err('do not provide both before and after for pagination', HTTP_STATUS.BAD_REQUEST);
    }

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsDate()
  before: Date | null;

  @IsOptional()
  @IsDate()
  after: Date | null;

  @Min(0)
  @Max(Pagination.CONSTANTS.MAX_LIMIT)
  @IsInt()
  limit: number;
}
