import { IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import { NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE } from '../../models/notifications/base';

export interface CreateEmailNotificationInterface {
  name: string;
  email: string;
  type: typeof NOTIFICATION_TYPE.EMAIL;
}

export type CreateEmailNotificationConstructorInterface = Omit<CreateEmailNotificationInterface, 'type'>;

/**
 * @class
 */
export class CreateEmailNotification extends ValidatedBase implements CreateEmailNotificationInterface {
  /**
   * @param {CreateEmailNotificationInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateEmailNotificationConstructorInterface, validate = true) {
    super();

    this.name = params.name;
    this.email = params.email;
    this.type = NOTIFICATION_TYPE.EMAIL;

    if (validate) {
      this.validate();
    }
  }

  @MaxLength(NOTIFICATION_CONSTANTS.MAX_NAME_LENGTH)
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(NOTIFICATION_TYPE, { message: enumError({ email: NOTIFICATION_TYPE.EMAIL }) })
  type: typeof NOTIFICATION_TYPE.EMAIL;
}
