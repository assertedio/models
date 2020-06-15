import { isDate, isFunction, isNil, isNumber, isString } from 'lodash';
import { DateTime } from 'luxon';

export const stringNotDate = (input: any | string): input is string => {
  return isString(input);
};

interface FirestoreTimestamp {
  toDate(): Date;
}

export const firestoreTimestamp = (input: any | FirestoreTimestamp): input is FirestoreTimestamp => {
  return isFunction((input as FirestoreTimestamp).toDate);
};

export const toDate = (input: Date | string | FirestoreTimestamp | DateTime | number): Date => {
  // This nil case expects that the validation will throw elsewhere
  if (isNil(input)) return input;
  if (isNumber(input)) return DateTime.fromMillis(input as number).toJSDate();
  if (isDate(input)) return DateTime.fromJSDate(input).toUTC().toJSDate();
  if (firestoreTimestamp(input)) return DateTime.fromJSDate(input.toDate()).toJSDate();
  if (DateTime.isDateTime(input)) return input.toJSDate();

  return stringNotDate(input) ? DateTime.fromISO(input).toUTC().toJSDate() : input;
};

/**
 * Strip unsupported characters
 *
 * @param {string} input
 * @returns {string}
 */
export const cleanString = (input: string): string => {
  return input.replace(/\s+/g, ' ').trim();
};
