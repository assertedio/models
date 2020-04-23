import { CreateEmailNotification } from './email';
import { CreatePhoneNotification } from './phone';
import { CreateSlackWebhookNotification } from './slackWebhook';

export type CreateNotification = CreateEmailNotification | CreatePhoneNotification | CreateSlackWebhookNotification;
