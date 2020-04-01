import { RunRecordInterface } from './runRecord';

export enum BUCKET_SIZE {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

/* eslint-disable no-magic-numbers */
export const BUCKET_SIZE_MIN = {
  [BUCKET_SIZE.HOUR]: 60,
  [BUCKET_SIZE.DAY]: 60 * 24,
  [BUCKET_SIZE.WEEK]: 60 * 24 * 7,
  [BUCKET_SIZE.MONTH]: 60 * 24 * 7 * 4,
};
/* eslint-enable no-magic-numbers */

export interface StatsResultInterface {
  start: Date;
  end: Date;
  runs: {
    availability: number;
    passes: number;
    failures: number;
    total: number;
  };
  tests: {
    availability: number;
    passes: number;
    failures: number;
    total: number;
  };
}

export interface BucketResultInterface {
  start: Date;
  end: Date;
  bucketSize: BUCKET_SIZE;
  overall: StatsResultInterface;
  buckets: StatsResultInterface[];
}

export enum TIMELINE_EVENT_STATUS {
  UP = 'up',
  IMPAIRED = 'impaired',
  DOWN = 'down',
  UNKNOWN = 'unknown',
}

export interface TimelineEvent {
  start: Date;
  end: Date;
  status: TIMELINE_EVENT_STATUS;
}

export interface SummaryResultInterface {
  start: Date;
  end: Date;
  latestStatus: TimelineEvent | null;
  latestDowntime: TimelineEvent | null;
  day: StatsResultInterface;
  week: StatsResultInterface;
  month: StatsResultInterface;
}

export interface StatusResultInterface {
  start: Date;
  end: Date;
  latestStatus: TimelineEvent | null;
  records: RunRecordInterface[];
}
