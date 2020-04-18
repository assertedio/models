import { IsInstance, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CompletedRunRecord, CompletedRunRecordConstructorInterface, CompletedRunRecordInterface, RoutineInterface } from '../models';
import { TIMELINE_EVENT_STATUS, TimelineEvent, TimelineEventConstructorInterface, TimelineEventInterface } from '../models/timelineEvent';
import { ValidatedBase } from '../validatedBase';

export enum ROUTINE_CONFIG_STATUS {
  DISABLED = 'disabled',
  NOT_PUSHED = 'notPushed',
  NO_RECORDS = 'noRecords',
  ACTIVE = 'active',
}

export type OVERALL_ROUTINE_STATUS = ROUTINE_CONFIG_STATUS | TIMELINE_EVENT_STATUS;

export interface RoutineStatusInterface {
  overallStatus: OVERALL_ROUTINE_STATUS;
  status: TimelineEventInterface | null;
  record: CompletedRunRecordInterface | null;
}

export interface RoutineStatusConstructorInterface {
  overallStatus: OVERALL_ROUTINE_STATUS;
  status: TimelineEventConstructorInterface | null;
  record: CompletedRunRecordConstructorInterface | null;
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
    this.record = params.record ? new CompletedRunRecord(params.record, false) : null;
    this.status = params.status ? new TimelineEvent(params.status, false) : null;

    if (validate) {
      this.validate();
    }
  }

  /**
   * Create instance
   * @param {RoutineInterface} routine
   * @param {TimelineEventInterface} status
   * @param {CompletedRunRecordInterface} record
   * @returns {RoutineStatus}
   */
  static create(routine: RoutineInterface, status: TimelineEventInterface | null, record: CompletedRunRecordInterface | null): RoutineStatus {
    let overallStatus;

    if (!routine.hasPackage) {
      overallStatus = ROUTINE_CONFIG_STATUS.NOT_PUSHED;
    } else if (!routine.enabled) {
      overallStatus = ROUTINE_CONFIG_STATUS.DISABLED;
    } else {
      overallStatus = status?.status || ROUTINE_CONFIG_STATUS.NO_RECORDS;
    }

    return new RoutineStatus({ status, record, overallStatus });
  }

  @IsString()
  overallStatus: OVERALL_ROUTINE_STATUS;

  @IsOptional()
  @ValidateNested()
  @IsInstance(CompletedRunRecord)
  record: CompletedRunRecordInterface | null;

  @IsOptional()
  @ValidateNested()
  @IsInstance(TimelineEvent)
  status: TimelineEventInterface | null;
}
