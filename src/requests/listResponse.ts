import { IsArray, IsDate, IsOptional, ValidateNested } from 'class-validator';

import { ValidatedBase } from 'validated-base';
import { toDate } from '../utils';

export interface ListResponseInterface<T> {
  list: T[];
  nextAfter?: Date;
  prevBefore?: Date;
}

export interface ListResponseConstructorInterface {
  list: any[];
  nextAfter?: Date | string;
  prevBefore?: Date | string;
}

/**
 * @class
 */
export class ListResponse<T> extends ValidatedBase implements ListResponseInterface<T> {
  // TODO [@ehacke/eslint-config@>1.1.5]: constructor should be type C: { new (parms, validate: boolean): T }

  /**
   * @param {} params
   * @param {any} C
   * @param {} validate
   * @returns {}
   */
  constructor(params: ListResponseConstructorInterface, C: any, validate = true) {
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
