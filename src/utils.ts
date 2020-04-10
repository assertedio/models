import { isDate, isFunction, isNil, isObject, isString } from 'lodash';
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

export const toDate = (input: Date | string | FirestoreTimestamp): Date => {
  if (isNil(input)) return input;
  if (isDate(input)) return input;
  if (firestoreTimestamp(input)) return input.toDate();
  return stringNotDate(input) ? DateTime.fromISO(input).toUTC().toJSDate() : input;
};

/**
 * Strip unsupported characters
 * @param {string} input
 * @returns {string}
 */
export const cleanString = (input: string): string => {
  return input.replace(/\s+/g, ' ').trim();
};

/**
 * Enum error message
 * @param {{}} entity
 * @returns {string | undefined}
 */
export const enumError = (entity: any): string | undefined => {
  if (!isObject(entity)) return undefined;
  return `$property must be one of: ${Object.values(entity).join(', ')}`;
};
