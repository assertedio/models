import { IsEnum, IsString, IsUrl, MaxLength } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import { NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE } from '../../models/notifications/base';

export interface CreateSlackWebhookNotificationInterface {
  name: string;
  webhookUrl: string;
  type: typeof NOTIFICATION_TYPE.SLACK_WEBHOOK;
}

export type CreateSlackWebhookNotificationConstructorInterface = Omit<CreateSlackWebhookNotificationInterface, 'type'>;

/**
 * @class
 */
export class CreateSlackWebhookNotification extends ValidatedBase implements CreateSlackWebhookNotificationInterface {
  /**
   * @param {CreateSlackWebhookNotificationInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateSlackWebhookNotificationConstructorInterface, validate = true) {
    super();

    this.name = params.name;
    this.webhookUrl = params.webhookUrl;
    this.type = NOTIFICATION_TYPE.SLACK_WEBHOOK;

    if (validate) {
      this.validate();
    }
  }

  @MaxLength(NOTIFICATION_CONSTANTS.MAX_NAME_LENGTH)
  @IsString()
  name: string;

  @IsUrl()
  webhookUrl: string;

  @IsEnum(NOTIFICATION_TYPE, { message: enumError({ slackWebhook: NOTIFICATION_TYPE.SLACK_WEBHOOK }) })
  type: typeof NOTIFICATION_TYPE.SLACK_WEBHOOK;
}
