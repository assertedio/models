import { isString } from 'lodash';
import { DateTime } from 'luxon';

export const stringNotDate = (input: Date | string): input is string => {
  return isString(input);
};

export const toDate = (input: Date | string): Date => {
  return stringNotDate(input) ? DateTime.fromISO(input).toUTC().toJSDate() : input;
};
