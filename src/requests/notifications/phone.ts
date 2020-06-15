import { IsEnum, IsString, Length, Matches, MaxLength } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import { NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE } from '../../models/notifications/base';
import { PHONE_NOTIFY_TYPE } from '../../models/notifications/phone';

export interface CreatePhoneNotificationInterface {
  name: string;
  notifyType: PHONE_NOTIFY_TYPE;
  number: string;
  type: typeof NOTIFICATION_TYPE.PHONE;
  code: string;
}

export type CreatePhoneNotificationConstructorInterface = Omit<CreatePhoneNotificationInterface, 'type'>;

export const PHONE_CODE_REGEX = /^\d{6}$/;
/**
 * @class
 */
export class CreatePhoneNotification extends ValidatedBase implements CreatePhoneNotificationInterface {
  /**
   * @param {CreatePhoneNotificationInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreatePhoneNotificationConstructorInterface, validate = true) {
    super();

    this.name = params.name;
    this.notifyType = params.notifyType;
    this.number = params.number;
    this.type = NOTIFICATION_TYPE.PHONE;
    this.code = params.code;

    if (validate) {
      this.validate();
    }
  }

  @MaxLength(NOTIFICATION_CONSTANTS.MAX_NAME_LENGTH)
  @IsString()
  name: string;

  @IsEnum(PHONE_NOTIFY_TYPE)
  notifyType: PHONE_NOTIFY_TYPE;

  @IsString()
  number: string;

  /* eslint-disable no-magic-numbers */
  @Matches(PHONE_CODE_REGEX, { message: 'Code must be 6 digits' })
  @Length(6, undefined, { message: 'Code must be 6 digits' })
  @IsString()
  code: string;
  /* eslint-enable no-magic-numbers */

  @IsEnum(NOTIFICATION_TYPE, { message: enumError({ email: NOTIFICATION_TYPE.PHONE }) })
  type: typeof NOTIFICATION_TYPE.PHONE;
}
