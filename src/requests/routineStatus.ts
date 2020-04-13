import { IsString } from 'class-validator';

import { RoutineInterface } from '../models';
import { SummaryResult, SummaryResultConstructorInterface, SummaryResultInterface } from './summaryResult';
import { TIMELINE_EVENT_STATUS } from './timelineEvent';

export enum ROUTINE_CONFIG_STATUS {
  DISABLED = 'disabled',
  NOT_PUSHED = 'notPushed',
  NO_RECORDS = 'noRecords',
}

export type OVERALL_ROUTINE_STATUS = ROUTINE_CONFIG_STATUS | TIMELINE_EVENT_STATUS;

export interface RoutineStatusInterface extends SummaryResultInterface {
  overallStatus: OVERALL_ROUTINE_STATUS;
}

export interface RoutineStatusConstructorInterface extends SummaryResultConstructorInterface {
  overallStatus: OVERALL_ROUTINE_STATUS;
}

/**
 * @class
 */
export class RoutineStatus extends SummaryResult implements RoutineStatusInterface {
  /**
   * @param {RoutineStatusConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: RoutineStatusConstructorInterface, validate = true) {
    super(params, false);

    this.overallStatus = params.overallStatus;

    if (validate) {
      this.validate();
    }
  }

  /**
   * Create instance
   * @param {RoutineInterface} routine
   * @param {SummaryResultInterface} status
   * @returns {RoutineStatus}
   */
  static create(routine: RoutineInterface, status: SummaryResultInterface): RoutineStatus {
    let overallStatus;

    if (!routine.hasPackage) {
      overallStatus = ROUTINE_CONFIG_STATUS.NOT_PUSHED;
    } else if (!routine.enabled) {
      overallStatus = ROUTINE_CONFIG_STATUS.DISABLED;
    } else {
      overallStatus = status.latestStatus?.status || ROUTINE_CONFIG_STATUS.NO_RECORDS;
    }

    return new RoutineStatus({ ...status, overallStatus });
  }

  @IsString()
  overallStatus: OVERALL_ROUTINE_STATUS;
}
