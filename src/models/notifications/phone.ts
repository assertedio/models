import { IsBoolean, IsDate, IsEnum, IsString, MaxLength } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { isObject, isString } from 'lodash';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';

import { enumError, ValidatedBase } from 'validated-base';
import { toDate } from '../../utils';
import { BaseNotificationConfigInterface, NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE, ORIGIN_TYPE } from './base';

export enum PHONE_NOTIFY_TYPE {
  VOICE = 'voice',
  SMS = 'sms',
}

export interface PhoneNotificationConfigInterface extends BaseNotificationConfigInterface {
  number: string;
  verified: boolean;
  notifyType: PHONE_NOTIFY_TYPE;
}

export interface PhoneNotificationConfigConstructorInterface
  extends Omit<PhoneNotificationConfigInterface, 'createdAt' | 'updatedAt' | 'type' | 'origin'> {
  createdAt: Date | string;
  updatedAt: Date | string;
  origin?: ORIGIN_TYPE;
}

export const isPhoneConfig = (input: any): input is PhoneNotificationConfigInterface =>
  isObject(input) && (input as PhoneNotificationConfigInterface).type === NOTIFICATION_TYPE.PHONE;

type CreatePhoneNotificationInterface = Pick<
  PhoneNotificationConfigInterface,
  'routineId' | 'projectId' | 'name' | 'origin' | 'notifyType' | 'number'
>;

/**
 * @class
 */
export class PhoneNotificationConfig extends ValidatedBase implements PhoneNotificationConfigInterface {
  static CONSTANTS = {
    ID_PREFIX: `${NOTIFICATION_CONSTANTS.BASE_ID_PREFIX}ph-`,
  };

  /**
   * Is this model ID
   *
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
    this.name = params.name;
    this.enabled = params.enabled;
    this.routineId = params.routineId;
    this.projectId = params.projectId;
    this.origin = params.origin || ORIGIN_TYPE.MEMBER;
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
  readonly type: NOTIFICATION_TYPE.PHONE = NOTIFICATION_TYPE.PHONE;

  @MaxLength(NOTIFICATION_CONSTANTS.MAX_NAME_LENGTH)
  @IsString()
  name: string;

  @IsBoolean()
  enabled: boolean;

  @IsEnum(ORIGIN_TYPE, { message: enumError(ORIGIN_TYPE) })
  readonly origin: ORIGIN_TYPE;

  @IsString()
  readonly routineId: string;

  @IsString()
  readonly projectId: string;

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
   *
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
   *
   * @param {CreatePhoneNotificationInterface} params
   * @param params
   * @param {Date} curDate
   * @returns {PhoneNotificationConfig}
   */
  static create(params: CreatePhoneNotificationInterface, curDate = DateTime.utc().toJSDate()): PhoneNotificationConfig {
    const { routineId, projectId, name, number, notifyType, origin } = params;

    if (!isString(number)) {
      throw new Err('number must be a string', HTTP_STATUS.BAD_REQUEST);
    }

    const phoneNumber = parsePhoneNumberFromString(number);

    if (!phoneNumber?.isPossible()) {
      throw new Err('number does not look like a phone number', HTTP_STATUS.BAD_REQUEST);
    }

    const parsedNUmber = phoneNumber?.number as string;

    return new PhoneNotificationConfig({
      id: PhoneNotificationConfig.generateId(routineId, parsedNUmber, notifyType),
      number: parsedNUmber,
      notifyType,
      verified: false,
      enabled: true,
      routineId,
      projectId,
      name,
      origin,
      createdAt: curDate,
      updatedAt: curDate,
    });
  }
}
