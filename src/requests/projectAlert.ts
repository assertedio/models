export enum PROJECT_ALERT_LEVEL {
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
}

export enum PROJECT_ALERT_TYPE {
  SMS_REMAINING = 'smsRemaining',
}

export const PROJECT_ALERT_TYPES = Object.values(PROJECT_ALERT_TYPE);

export interface ProjectAlertLink {
  url: string;
  text: string;
}

export interface ProjectAlertInterface {
  message: string;
  type: PROJECT_ALERT_TYPE;
  level: PROJECT_ALERT_LEVEL;
  links: ProjectAlertLink[];
}
