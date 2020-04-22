import { IsBoolean, IsDate, IsEnum, IsString, IsUrl, MaxLength } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { isString } from 'lodash';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';

import { toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';
import { BaseNotificationConfigInterface, NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE } from './base';

export interface SlackWebhookNotificationConfigInterface extends BaseNotificationConfigInterface {
  webhookUrl: string;
  verified: boolean;
}

export interface SlackWebhookNotificationConfigConstructorInterface
  extends Omit<SlackWebhookNotificationConfigInterface, 'createdAt' | 'updatedAt' | 'type'> {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const isPossibleSlackWebhook = (input: string): boolean => isString(input) && input.startsWith('https://hooks.slack.com');

/**
 * @class
 */
export class SlackWebhookNotificationConfig extends ValidatedBase implements SlackWebhookNotificationConfigInterface {
  static CONSTANTS = {
    ID_PREFIX: 'nt-sw-',
  };

  /**
   * Is this model ID
   * @param {string} input
   * @returns {boolean}
   */
  static isId(input: string): boolean {
    return isString(input) && input.startsWith(SlackWebhookNotificationConfig.CONSTANTS.ID_PREFIX);
  }

  /**
   * @param {SlackWebhookNotificationConfigConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: SlackWebhookNotificationConfigConstructorInterface, validate = true) {
    super();

    this.id = params.id;
    this.type = NOTIFICATION_TYPE.SLACK_WEBHOOK;
    this.name = params.name;
    this.enabled = params.enabled;
    this.verified = params.verified;
    this.routineId = params.routineId;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);
    this.webhookUrl = params.webhookUrl;

    if (!isPossibleSlackWebhook(this.webhookUrl)) {
      throw new Err('webhook URL must start with: https://hooks.slack.com', HTTP_STATUS.BAD_REQUEST);
    }

    if (validate) {
      this.validate();
    }
  }

  @IsBoolean()
  verified: boolean;

  @IsString()
  readonly id: string;

  @IsEnum(NOTIFICATION_TYPE)
  readonly type: NOTIFICATION_TYPE.SLACK_WEBHOOK;

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

  @IsUrl()
  readonly webhookUrl: string;

  /**
   * Generate ID
   * @param {string} routineId
   * @param {string} slackWebhook
   * @returns {string}
   */
  static generateId(routineId: string, slackWebhook: string): string {
    return `${SlackWebhookNotificationConfig.CONSTANTS.ID_PREFIX}${shorthash.unique(routineId + slackWebhook)}`;
  }

  /**
   * Create instance of model
   * @param {string} routineId
   * @param {string} name
   * @param {string} webhookUrl
   * @param {Date} curDate
   * @returns {SlackWebhookNotificationConfig}
   */
  static create(routineId: string, name: string, webhookUrl: string, curDate = DateTime.utc().toJSDate()): SlackWebhookNotificationConfig {
    return new SlackWebhookNotificationConfig({
      id: SlackWebhookNotificationConfig.generateId(routineId, webhookUrl),
      routineId,
      name,
      webhookUrl,
      verified: false,
      enabled: true,
      createdAt: curDate,
      updatedAt: curDate,
    });
  }
}
