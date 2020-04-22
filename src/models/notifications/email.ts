import { IsBoolean, IsDate, IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';
import { isString } from 'lodash';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';

import { toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';
import { BaseNotificationConfigInterface, NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE } from './base';

export interface EmailNotificationConfigInterface extends BaseNotificationConfigInterface {
  email: string;
  verified: boolean;
}

export interface EmailNotificationConfigConstructorInterface extends Omit<EmailNotificationConfigInterface, 'createdAt' | 'updatedAt' | 'type'> {
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * @class
 */
export class EmailNotificationConfig extends ValidatedBase implements EmailNotificationConfigInterface {
  static CONSTANTS = {
    ID_PREFIX: 'nt-em-',
  };

  /**
   * Is this model ID
   * @param {string} input
   * @returns {boolean}
   */
  static isId(input: string): boolean {
    return isString(input) && input.startsWith(EmailNotificationConfig.CONSTANTS.ID_PREFIX);
  }

  /**
   * @param {EmailNotificationConfigConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: EmailNotificationConfigConstructorInterface, validate = true) {
    super();

    this.id = params.id;
    this.type = NOTIFICATION_TYPE.EMAIL;
    this.name = params.name;
    this.enabled = params.enabled;
    this.routineId = params.routineId;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);
    this.email = params.email;
    this.verified = params.verified;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsEnum(NOTIFICATION_TYPE)
  readonly type: NOTIFICATION_TYPE.EMAIL;

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

  @IsEmail()
  readonly email: string;

  @IsBoolean()
  verified: boolean;

  /**
   * Generate ID
   * @param {string} routineId
   * @param {string} email
   * @returns {string}
   */
  static generateId(routineId: string, email: string): string {
    return `${EmailNotificationConfig.CONSTANTS.ID_PREFIX}${shorthash.unique(routineId + email)}`;
  }

  /**
   * Create instance of model
   * @param {string} routineId
   * @param {string} name
   * @param {string} email
   * @param {Date} curDate
   * @returns {EmailNotificationConfig}
   */
  static create(routineId: string, name: string, email: string, curDate = DateTime.utc().toJSDate()): EmailNotificationConfig {
    return new EmailNotificationConfig({
      id: EmailNotificationConfig.generateId(routineId, email),
      routineId,
      name,
      email,
      verified: false,
      enabled: true,
      createdAt: curDate,
      updatedAt: curDate,
    });
  }
}
