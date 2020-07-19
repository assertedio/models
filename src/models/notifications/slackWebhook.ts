import { IsBoolean, IsDate, IsEnum, IsString, IsUrl, MaxLength } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { isObject, isString } from 'lodash';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';

import { enumError, ValidatedBase } from 'validated-base';
import { toDate } from '../../utils';
import { BaseNotificationConfigInterface, NOTIFICATION_CONSTANTS, NOTIFICATION_TYPE, ORIGIN_TYPE } from './base';

export interface SlackWebhookNotificationConfigInterface extends BaseNotificationConfigInterface {
  webhookUrl: string;
}

export interface SlackWebhookNotificationConfigConstructorInterface
  extends Omit<SlackWebhookNotificationConfigInterface, 'createdAt' | 'updatedAt' | 'type' | 'verified' | 'origin'> {
  createdAt: Date | string;
  updatedAt: Date | string;
  origin?: ORIGIN_TYPE;
}

export const isPossibleSlackWebhook = (input: string): boolean =>
  isString(input) &&
  (input.startsWith('https://hooks.slack.com') || (input.startsWith('https://discord.com/api') && input.replace(/\/$/, '').endsWith('slack')));

export const isSlackWebhookConfig = (input: any): input is SlackWebhookNotificationConfigInterface =>
  isObject(input) && (input as SlackWebhookNotificationConfigInterface).type === NOTIFICATION_TYPE.SLACK_WEBHOOK;

type CreateSlackWebhookNotificationInterface = Pick<
  SlackWebhookNotificationConfigInterface,
  'routineId' | 'projectId' | 'name' | 'origin' | 'webhookUrl'
>;

/**
 * @class
 */
export class SlackWebhookNotificationConfig extends ValidatedBase implements SlackWebhookNotificationConfigInterface {
  static CONSTANTS = {
    ID_PREFIX: `${NOTIFICATION_CONSTANTS.BASE_ID_PREFIX}sw-`,
  };

  /**
   * Is this model ID
   *
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
    this.name = params.name;
    this.enabled = params.enabled;
    this.routineId = params.routineId;
    this.projectId = params.projectId;
    this.origin = params.origin || ORIGIN_TYPE.MEMBER;
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

  @IsString()
  readonly id: string;

  @IsEnum(NOTIFICATION_TYPE)
  readonly type: NOTIFICATION_TYPE.SLACK_WEBHOOK = NOTIFICATION_TYPE.SLACK_WEBHOOK;

  @MaxLength(NOTIFICATION_CONSTANTS.MAX_NAME_LENGTH)
  @IsString()
  name: string;

  @IsBoolean()
  enabled: boolean;

  @IsEnum(ORIGIN_TYPE, { message: enumError(ORIGIN_TYPE) })
  readonly origin: ORIGIN_TYPE;

  @IsBoolean()
  readonly verified: boolean = true;

  @IsString()
  readonly routineId: string;

  @IsString()
  readonly projectId: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsUrl()
  readonly webhookUrl: string;

  /**
   * Generate ID
   *
   * @param {string} routineId
   * @param {string} slackWebhook
   * @returns {string}
   */
  static generateId(routineId: string, slackWebhook: string): string {
    return `${SlackWebhookNotificationConfig.CONSTANTS.ID_PREFIX}${shorthash.unique(routineId + slackWebhook)}`;
  }

  /**
   * Create instance of model
   *
   * @param {CreateSlackWebhookNotificationInterface} params
   * @param {Date} curDate
   * @returns {SlackWebhookNotificationConfig}
   */
  static create(params: CreateSlackWebhookNotificationInterface, curDate = DateTime.utc().toJSDate()): SlackWebhookNotificationConfig {
    const { routineId, projectId, name, webhookUrl, origin } = params;

    return new SlackWebhookNotificationConfig({
      id: SlackWebhookNotificationConfig.generateId(routineId, webhookUrl),
      routineId,
      projectId,
      name,
      origin,
      webhookUrl,
      enabled: true,
      createdAt: curDate,
      updatedAt: curDate,
    });
  }
}
