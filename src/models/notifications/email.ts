import { IsBoolean, IsDate, IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';
import { isObject, isString } from 'lodash';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';

import { enumError, ValidatedBase } from 'validated-base';
import { toDate } from '../../utils';
import { BaseNotificationConfigInterface, NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE, ORIGIN_TYPE } from './base';

export interface EmailNotificationConfigInterface extends BaseNotificationConfigInterface {
  email: string;
  verified: boolean;
}

export interface EmailNotificationConfigConstructorInterface
  extends Omit<EmailNotificationConfigInterface, 'createdAt' | 'updatedAt' | 'type' | 'origin'> {
  createdAt: Date | string;
  updatedAt: Date | string;
  origin?: ORIGIN_TYPE;
}

export const isEmailConfig = (input: any): input is EmailNotificationConfigInterface =>
  isObject(input) && (input as EmailNotificationConfigInterface).type === NOTIFICATION_TYPE.EMAIL;

export type CreateEmailNotificationInterface = Pick<EmailNotificationConfigInterface, 'routineId' | 'projectId' | 'name' | 'origin' | 'email'>;

/**
 * @class
 */
export class EmailNotificationConfig extends ValidatedBase implements EmailNotificationConfigInterface {
  static CONSTANTS = {
    ID_PREFIX: 'nt-em-',
  };

  /**
   * Is this model ID
   *
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
    this.name = params.name;
    this.enabled = params.enabled;
    this.routineId = params.routineId;
    this.projectId = params.projectId;
    this.origin = params.origin || ORIGIN_TYPE.MEMBER;
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
  readonly type: NOTIFICATION_TYPE.EMAIL = NOTIFICATION_TYPE.EMAIL;

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

  @IsEmail()
  readonly email: string;

  @IsBoolean()
  verified: boolean;

  /**
   * Generate ID
   *
   * @param {string} routineId
   * @param {string} email
   * @returns {string}
   */
  static generateId(routineId: string, email: string): string {
    return `${EmailNotificationConfig.CONSTANTS.ID_PREFIX}${shorthash.unique(routineId + email)}`;
  }

  /**
   * Create instance of model
   *
   * @param {CreateEmailNotificationInterface} params
   * @param {Date} curDate
   * @returns {EmailNotificationConfig}
   */
  static create(params: CreateEmailNotificationInterface, curDate = DateTime.utc().toJSDate()): EmailNotificationConfig {
    const { routineId, projectId, email, name, origin } = params;

    return new EmailNotificationConfig({
      id: EmailNotificationConfig.generateId(routineId, email),
      routineId,
      projectId,
      origin,
      name,
      email,
      verified: false,
      enabled: true,
      createdAt: curDate,
      updatedAt: curDate,
    });
  }
}
