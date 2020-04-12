import { IsString } from 'class-validator';

import { SummaryResult, SummaryResultConstructorInterface, SummaryResultInterface } from './summaryResult';
import { TIMELINE_EVENT_STATUS } from './timelineEvent';

export enum ROUTINE_CONFIG_STATUS {
  DISABLED = 'disabled',
  NOT_PUSHED = 'notPushed',
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

  @IsString()
  overallStatus: OVERALL_ROUTINE_STATUS;
}
