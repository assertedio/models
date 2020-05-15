import { IsDate, IsInstance, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CompletedRunRecord, CompletedRunRecordConstructorInterface, CompletedRunRecordInterface, RoutineInterface } from '../models';
import { TIMELINE_EVENT_STATUS, TimelineEvent, TimelineEventConstructorInterface, TimelineEventInterface } from '../models/timelineEvent';
import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';
import { Uptimes, UptimesConstructorInterface, UptimesInterface } from './uptime';

export enum ROUTINE_CONFIG_STATUS {
  DISABLED = 'disabled',
  NOT_PUSHED = 'notPushed',
  NO_RECORDS = 'noRecords',
  ACTIVE = 'active',
}

export type OVERALL_ROUTINE_STATUS = ROUTINE_CONFIG_STATUS | TIMELINE_EVENT_STATUS;

export interface RoutineStatusInterface {
  overallStatus: OVERALL_ROUTINE_STATUS;
  nextRunAt: Date | null;
  status: TimelineEventInterface | null;
  record: CompletedRunRecordInterface | null;
  uptimes: UptimesInterface;
  downtime: TimelineEventInterface | null;
}

export interface RoutineStatusConstructorInterface {
  overallStatus: OVERALL_ROUTINE_STATUS;
  nextRunAt: Date | null;
  status: TimelineEventConstructorInterface | null;
  record: CompletedRunRecordConstructorInterface | null;
  uptimes: UptimesConstructorInterface;
  downtime: TimelineEventInterface | null;
}

/**
 * @class
 */
export class RoutineStatus extends ValidatedBase implements RoutineStatusInterface {
  /**
   * @param {RoutineStatusConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: RoutineStatusConstructorInterface, validate = true) {
    super();

    this.overallStatus = params.overallStatus;
    this.nextRunAt = params.nextRunAt ? toDate(params.nextRunAt) : null;
    this.record = params.record ? new CompletedRunRecord(params.record, false) : null;
    this.status = params.status ? new TimelineEvent(params.status, false) : null;
    this.downtime = params.downtime ? new TimelineEvent(params.downtime, false) : null;
    this.uptimes = new Uptimes(params.uptimes, false);

    if (validate) {
      this.validate();
    }
  }

  /**
   * Get overall status
   *
   * @param {RoutineInterface} routine
   * @param {TimelineEventConstructorInterface} status
   * @returns {OVERALL_ROUTINE_STATUS}
   */
  static getOverallStatus(routine: RoutineInterface, status: TimelineEventConstructorInterface | null): OVERALL_ROUTINE_STATUS {
    if (!routine.hasPackage) {
      return ROUTINE_CONFIG_STATUS.NOT_PUSHED;
    }
    if (!routine.enabled) {
      return ROUTINE_CONFIG_STATUS.DISABLED;
    }
    return status?.status || ROUTINE_CONFIG_STATUS.NO_RECORDS;
  }

  /**
   * Create instance
   *
   * @param {RoutineInterface} routine
   * @param {RoutineStatusConstructorInterface} params
   * @returns {RoutineStatus}
   */
  static create(routine: RoutineInterface, params: Omit<RoutineStatusConstructorInterface, 'overallStatus' | 'nextRunAt'>): RoutineStatus {
    const { status, record, uptimes, downtime } = params;
    return new RoutineStatus({ overallStatus: RoutineStatus.getOverallStatus(routine, status), nextRunAt: null, status, record, uptimes, downtime });
  }

  @IsString()
  overallStatus: OVERALL_ROUTINE_STATUS;

  @IsOptional()
  @IsDate()
  nextRunAt: Date | null;

  @IsOptional()
  @ValidateNested()
  @IsInstance(CompletedRunRecord)
  record: CompletedRunRecordInterface | null;

  @IsOptional()
  @ValidateNested()
  @IsInstance(TimelineEvent)
  status: TimelineEventInterface | null;

  @IsOptional()
  @ValidateNested()
  @IsInstance(TimelineEvent)
  downtime: TimelineEventInterface | null;

  @ValidateNested()
  @IsInstance(Uptimes)
  uptimes: UptimesInterface;
}
