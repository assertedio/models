import { IsEnum, IsString, MaxLength } from 'class-validator';

import { NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE } from '../../models/notifications/base';
import { PHONE_NOTIFY_TYPE } from '../../models/notifications/phone';
import { enumError } from '../../utils';
import { ValidatedBase } from '../../validatedBase';

export interface CreatePhoneNotificationInterface {
  name: string;
  notifyType: PHONE_NOTIFY_TYPE;
  number: string;
  type: typeof NOTIFICATION_TYPE.PHONE;
}

export type CreatePhoneNotificationConstructorInterface = Omit<CreatePhoneNotificationInterface, 'type'>;

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

  @IsEnum(NOTIFICATION_TYPE, { message: enumError({ email: NOTIFICATION_TYPE.PHONE }) })
  type: typeof NOTIFICATION_TYPE.PHONE;
}
