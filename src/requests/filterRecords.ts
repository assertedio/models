import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { DateTime } from 'luxon';

import { RUN_STATUS } from '../models/runRecord';
import { enumError, toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

interface FilterRecordsConstructorInterface {
  routineIds?: string[];
  status?: RUN_STATUS;
  start?: Date | string;
  end?: Date | string;
}

export interface FilterRecordsInterface {
  routineIds: string[] | null;
  status: RUN_STATUS | null;
  start: Date;
  end: Date;
}

const CONSTANTS = {
  DEFAULT_START_OFFSET_DAYS: 7,
  DEFAULT_END_OFFSET_DAYS: 1,
};

/**
 * @class
 */
export class FilterRecords extends ValidatedBase implements FilterRecordsInterface {
  /**
   * @param {FilterRecordsConstructorInterface} params
   * @param {boolean} validate
   * @param {DateTime} curDateTime
   */
  constructor(params: FilterRecordsConstructorInterface, validate = true, curDateTime = DateTime.utc()) {
    super();

    this.routineIds = params.routineIds || null;
    this.status = params.status || null;
    this.start = toDate(params.start || curDateTime.minus({ days: CONSTANTS.DEFAULT_START_OFFSET_DAYS }).toJSDate());
    this.end = toDate(params.end || curDateTime.plus({ days: CONSTANTS.DEFAULT_END_OFFSET_DAYS }).toJSDate());

    if (this.end.valueOf() - this.start.valueOf() <= 0) {
      throw new Err('start must be before end', HTTP_STATUS.BAD_REQUEST);
    }

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsString({ each: true })
  routineIds: string[] | null;

  @IsOptional()
  @IsEnum(RUN_STATUS, { message: enumError(RUN_STATUS) })
  status: RUN_STATUS | null;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;
}
