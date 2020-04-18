import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface PaginationInterface {
  start: Date | null;
  limit: number;
}

export interface PaginationConstructorInterface {
  start?: Date | string | number;
  limit?: number;
}

export type CompletePaginationInterface = Required<PaginationInterface>;

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
    this.limit = params.limit || Pagination.CONSTANTS.DEFAULT_LIMIT;

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsDate()
  start: Date | null;

  @Min(0)
  @Max(Pagination.CONSTANTS.MAX_LIMIT)
  @IsInt()
  limit: number;
}
