import { IsDate, IsOptional } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { DateTime } from 'luxon';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface DateFilterInterface {
  start: Date;
  end?: Date;
}

export interface DateTimeFilterInterface {
  start: DateTime;
  end?: DateTime;
}

export interface DateFilterConstructorInterface {
  start: Date | string;
  end?: Date | string;
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

    this.start = toDate(params.start);
    this.end = params.end ? toDate(params.end) : undefined;

    if (this.end && this.start > this.end) {
      throw new Err('if end is provided, start must come before end', HTTP_STATUS.BAD_REQUEST);
    }

    if (validate) {
      this.validate();
    }
  }

  @IsDate()
  start: Date;

  @IsOptional()
  @IsDate()
  end?: Date;

  /**
   * Convert to DateTime versions
   * @returns {DateTimeFilterInterface}
   */
  toDateTime(): DateTimeFilterInterface {
    return {
      start: DateTime.fromJSDate(this.start),
      end: this.end ? DateTime.fromJSDate(this.end) : undefined,
    };
  }
}
