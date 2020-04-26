import { EmailNotificationConfig, EmailNotificationConfigInterface } from './email';
import { PhoneNotificationConfig, PhoneNotificationConfigInterface } from './phone';
import { SlackWebhookNotificationConfig, SlackWebhookNotificationConfigInterface } from './slackWebhook';

export type NotificationConfigInterface =
  | PhoneNotificationConfigInterface
  | EmailNotificationConfigInterface
  | SlackWebhookNotificationConfigInterface;
export type NotificationConfig = PhoneNotificationConfig | EmailNotificationConfig | SlackWebhookNotificationConfig;
