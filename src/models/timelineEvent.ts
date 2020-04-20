import { IsDate, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { ulid } from 'ulid';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export enum TIMELINE_EVENT_STATUS {
  UP = 'up',
  IMPAIRED = 'impaired',
  DOWN = 'down',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
}

export interface TimelineEventInterface {
  id: string;
  start: Date;
  end: Date;
  createdAt: Date;
  updatedAt: Date;
  recordCount: number;
  routineId: string;
  projectId: string;
  durationMs: number;
  status: TIMELINE_EVENT_STATUS;
}

export interface TimelineEventConstructorInterface extends Omit<TimelineEventInterface, 'start' | 'end' | 'durationMs' | 'createdAt' | 'updatedAt'> {
  start: Date | string;
  end: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * @class
 */
export class TimelineEvent extends ValidatedBase implements TimelineEventInterface {
  static CONSTANTS = {
    ID_PREFIX: 'te-',
  };

  /**
   * @param {TimelineEventConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: TimelineEventConstructorInterface, validate = true) {
    super();

    this.id = params.id;
    this.start = toDate(params.start);
    this.end = toDate(params.end);
    this.projectId = params.projectId;
    this.routineId = params.routineId;
    this.recordCount = params.recordCount;
    this.durationMs = this.end.valueOf() - this.start.valueOf();
    this.status = params.status;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @Min(0)
  @IsInt()
  recordCount: number;

  @Min(0)
  @IsInt()
  durationMs: number;

  @IsString()
  projectId: string;

  @IsString()
  routineId: string;

  @IsEnum(TIMELINE_EVENT_STATUS)
  status: TIMELINE_EVENT_STATUS;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  /**
   * Generate ID for model
   * @returns {string}
   */
  static generateId(): string {
    return TimelineEvent.CONSTANTS.ID_PREFIX + ulid();
  }
}
