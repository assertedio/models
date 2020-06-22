import { IsDate, IsEnum, IsInt, IsString, Min } from 'class-validator';
import shorthash from 'shorthash';

import { ValidatedBase } from 'validated-base';
import { toDate } from '../utils';

export enum TIMELINE_EVENT_STATUS {
  UP = 'up',
  IMPAIRED = 'impaired',
  DOWN = 'down',
  TIMEOUT = 'timeout',
  ERROR = 'error',
  UNKNOWN = 'unknown',
}

export interface TimelineEventInterface {
  id: string;
  start: Date;
  end: Date;
  routineId: string;
  projectId: string;
  durationMs: number;
  status: TIMELINE_EVENT_STATUS;
}

export interface TimelineEventConstructorInterface extends Omit<TimelineEventInterface, 'id' | 'start' | 'end' | 'durationMs'> {
  start: Date | string;
  end: Date | string;
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

    this.start = toDate(params.start);
    this.end = toDate(params.end);
    this.projectId = params.projectId;
    this.routineId = params.routineId;
    this.durationMs = this.end.valueOf() - this.start.valueOf();
    this.status = params.status;

    this.id = TimelineEvent.generateId(params.routineId, this.start);

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
  durationMs: number;

  @IsString()
  projectId: string;

  @IsString()
  routineId: string;

  @IsEnum(TIMELINE_EVENT_STATUS)
  status: TIMELINE_EVENT_STATUS;

  /**
   * Generate ID for model
   *
   * @param {string} routineId
   * @param {Date} start
   * @returns {string}
   */
  static generateId(routineId: string, start: Date): string {
    return TimelineEvent.CONSTANTS.ID_PREFIX + shorthash.unique(routineId + start.valueOf());
  }
}
