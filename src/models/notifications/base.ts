export enum NOTIFICATION_TYPE {
  EMAIL = 'email',
  PHONE = 'phone',
  SLACK_WEBHOOK = 'slackWebhook',
}

export enum ORIGIN_TYPE {
  MEMBER = 'member',
  PUBLIC = 'public',
}

export const NOTIFICATION_CONSTANTS = {
  MAX_NAME_LENGTH: 40,
};

export interface BaseNotificationConfigInterface {
  id: string;
  routineId: string;
  projectId: string;
  enabled: boolean;
  verified: boolean;
  origin: ORIGIN_TYPE;
  name: string;
  type: NOTIFICATION_TYPE;
  createdAt: Date;
  updatedAt: Date;
}
