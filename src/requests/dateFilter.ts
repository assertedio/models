import { IsDate, IsEnum, IsOptional } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { DateTime } from 'luxon';

import { ValidatedBase } from 'validated-base';
import { toDate } from '../utils';

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export interface DateFilterInterface {
  start?: Date;
  end?: Date;
  order: SORT_ORDER;
}

export interface DateTimeFilterInterface {
  start?: DateTime;
  end?: DateTime;
  order: SORT_ORDER;
}

export interface DateFilterConstructorInterface {
  start?: Date | string;
  end?: Date | string;
  order?: SORT_ORDER;
}

/**
 * @class
 */
export class DateFilter extends ValidatedBase implements DateFilterInterface {
  /**
   * @param {DateTimeFilterInterface} params
   * @param {boolean} validate
   */
  constructor(params: DateFilterConstructorInterface, validate = true) {
    super();

    this.start = params.start ? toDate(params.start) : undefined;
    this.end = params.end ? toDate(params.end) : undefined;
    this.order = params.order || SORT_ORDER.ASC;

    if (this.start && this.end && this.start > this.end) {
      throw new Err('if end and start, start must come before end', HTTP_STATUS.BAD_REQUEST);
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

  @IsEnum(SORT_ORDER)
  order: SORT_ORDER;

  /**
   * Convert to DateTime versions
   *
   * @returns {DateTimeFilterInterface}
   */
  toDateTime(): DateTimeFilterInterface {
    return {
      start: this.start ? DateTime.fromJSDate(this.start) : undefined,
      end: this.end ? DateTime.fromJSDate(this.end) : undefined,
      order: this.order,
    };
  }
}
