import { IsInstance, ValidateNested } from 'class-validator';

import { ValidatedBase } from 'validated-base';
import { DateFilter, DateFilterConstructorInterface, DateFilterInterface } from './dateFilter';
import { Pagination, PaginationConstructorInterface, PaginationInterface } from './pagination';

export interface SearchInterface {
  filter: DateFilterInterface;
  pagination: PaginationInterface;
}

export interface SearchConstructorInterface {
  filter?: DateFilterConstructorInterface;
  pagination?: PaginationConstructorInterface;
}

/**
 * @class
 */
export class Search extends ValidatedBase implements SearchInterface {
  /**
   * @param {SearchConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: SearchConstructorInterface, validate = true) {
    super();

    this.filter = new DateFilter(params.filter || {}, false);
    this.pagination = new Pagination(params.pagination || {}, false);

    if (validate) {
      this.validate();
    }
  }

  @ValidateNested()
  @IsInstance(DateFilter)
  filter: DateFilterInterface;

  @ValidateNested()
  @IsInstance(Pagination)
  pagination: PaginationInterface;
}
