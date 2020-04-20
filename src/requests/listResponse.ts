import { IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface ListResponseInterface<T> {
  list: T[];
  nextAfter?: Date;
  prevBefore?: Date;
}

export interface ListResponseConstructorInterface {
  list: {}[];
  nextAfter?: Date | string;
  prevBefore?: Date | string;
}

/**
 * @class
 */
export class ListResponse<T> extends ValidatedBase implements ListResponseInterface<T> {
  /**
   * @param {ListResponseInterface} params
   * @param {{}} C
   * @param {boolean} validate
   */
  constructor(params: ListResponseConstructorInterface, C: { new (parms, validate: boolean): T }, validate = true) {
    super();

    this.list = params.list.map((item) => new C(item, false));
    this.nextAfter = params.nextAfter ? toDate(params.nextAfter) : undefined;
    this.prevBefore = params.prevBefore ? toDate(params.prevBefore) : undefined;

    if (validate) {
      this.validate();
    }
  }

  @IsArray()
  @ValidateNested({ each: true })
  list: T[];

  @IsOptional()
  @IsDate()
  nextAfter?: Date;

  @IsOptional()
  @IsDate()
  prevBefore?: Date;
}
