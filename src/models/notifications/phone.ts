import { IsBoolean, IsDate, IsEnum, IsString, MaxLength } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { isObject, isString } from 'lodash';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';

import { toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';
import { BaseNotificationConfigInterface, NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE } from './base';

export enum PHONE_NOTIFY_TYPE {
  VOICE = 'voice',
  SMS = 'sms',
}

export interface PhoneNotificationConfigInterface extends BaseNotificationConfigInterface {
  number: string;
  verified: boolean;
  notifyType: PHONE_NOTIFY_TYPE;
}

export interface PhoneNotificationConfigConstructorInterface extends Omit<PhoneNotificationConfigInterface, 'createdAt' | 'updatedAt' | 'type'> {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const isPhoneConfig = (input: any): input is PhoneNotificationConfigInterface =>
  isObject(input) && (input as PhoneNotificationConfigInterface).type === NOTIFICATION_TYPE.PHONE;

/**
 * @class
 */
export class PhoneNotificationConfig extends ValidatedBase implements PhoneNotificationConfigInterface {
  static CONSTANTS = {
    ID_PREFIX: 'nt-ph-',
  };

  /**
   * Is this model ID
   * @param {string} input
   * @returns {boolean}
   */
  static isId(input: string): boolean {
    return isString(input) && input.startsWith(PhoneNotificationConfig.CONSTANTS.ID_PREFIX);
  }

  /**
   * @param {PhoneNotificationConfigConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: PhoneNotificationConfigConstructorInterface, validate = true) {
    super();

    this.id = params.id;
    this.type = NOTIFICATION_TYPE.PHONE;
    this.name = params.name;
    this.enabled = params.enabled;
    this.routineId = params.routineId;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);

    this.notifyType = params.notifyType;
    this.number = params.number;
    this.verified = params.verified;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsEnum(NOTIFICATION_TYPE)
  readonly type: NOTIFICATION_TYPE.PHONE;

  @MaxLength(NOTIFICATION_CONSTANTS.MAX_NAME_LENGTH)
  @IsString()
  name: string;

  @IsBoolean()
  enabled: boolean;

  @IsString()
  readonly routineId: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsEnum(PHONE_NOTIFY_TYPE)
  readonly notifyType: PHONE_NOTIFY_TYPE;

  @IsString()
  readonly number: string;

  @IsBoolean()
  verified: boolean;

  /**
   * Generate ID
   * @param {string} routineId
   * @param {string} phone
   * @param {PHONE_NOTIFY_TYPE} notifyType
   * @returns {string}
   */
  static generateId(routineId: string, phone: string, notifyType: PHONE_NOTIFY_TYPE): string {
    return `${PhoneNotificationConfig.CONSTANTS.ID_PREFIX}${shorthash.unique(routineId + phone + notifyType)}`;
  }

  /**
   * Create instance of model
   * @param {string} routineId
   * @param {string} name
   * @param {string} number
   * @param {PHONE_NOTIFY_TYPE} notifyType
   * @param {Date} curDate
   * @returns {PhoneNotificationConfig}
   */
  static create(
    routineId: string,
    name: string,
    number: string,
    notifyType: PHONE_NOTIFY_TYPE,
    curDate = DateTime.utc().toJSDate()
  ): PhoneNotificationConfig {
    if (!isString(number)) {
      throw new Err('number must be a string', HTTP_STATUS.BAD_REQUEST);
    }

    const phoneNumber = parsePhoneNumberFromString(number);

    if (!phoneNumber?.isPossible()) {
      throw new Err('number does not look like a phone number', HTTP_STATUS.BAD_REQUEST);
    }

    number = phoneNumber?.number as string;

    return new PhoneNotificationConfig({
      id: PhoneNotificationConfig.generateId(routineId, number, notifyType),
      number,
      notifyType,
      verified: false,
      enabled: true,
      routineId,
      name,
      createdAt: curDate,
      updatedAt: curDate,
    });
  }
}
