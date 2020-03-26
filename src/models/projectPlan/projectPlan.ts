import { IsDate, IsEnum, IsInstance, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { omit, startCase } from 'lodash';
import { DateTime } from 'luxon';
import { DeepPartial } from 'ts-essentials';

import { ValidatedBase } from '../../validatedBase';
import { PlanBilling, PlanBillingInterface } from './planBilling';
import { PlanLimits, PlanLimitsInterface, PlanLimitsOverrides, PlanLimitsOverridesInterface } from './planLimits';

export enum PLAN_IDS {
  FREE_V1 = 'free_v1',
  STANDARD_V1 = 'standard_v1',
  PRO_V1 = 'pro_v1',
}

export const PLAN_ID_VALUES = Object.values(PLAN_IDS);

export const getPrettyName = (planId) => {
  if (!PLAN_ID_VALUES.includes(planId)) {
    throw new Error(`${planId} is not a valid planId`);
  }

  return startCase(planId.split('_v')[0]);
};

export enum PLAN_STATUS {
  FAILED_PAYMENT = 'failedPayment',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export interface CreatePlanInterface {
  projectId: string;
  limitsOverrides: PlanLimitsOverridesInterface | null;
}

export interface PlanInterface extends CreatePlanInterface {
  id: string;
  name: string;
  planId: PLAN_IDS;
  status: PLAN_STATUS;
  extraSms: number;
  customerId: string | null;
  billing: PlanBillingInterface | null;
  limits: PlanLimitsInterface;
  createdAt: Date;
  updatedAt: Date;
}

const CONSTANTS = {
  ID_PREFIX: 'pl-',
  OMITTED_DB_PROPERTIES: ['name', 'limits', 'status', 'billing'],
  FREE_PLAN_SECONDS: 2,
};

export interface InvoiceInterface {
  created: string | null;
  due: string | null;
  amount: number;
  status: string;
  link: string | null;
  pdf: string | null;
}

/**
 * @class
 */
export class ProjectPlan extends ValidatedBase implements PlanInterface {
  static CONSTANTS = CONSTANTS;

  /**
   * @param {PlanInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: Omit<PlanInterface, 'name'>, validate = true) {
    super();

    this.id = params.id;
    this.projectId = params.projectId;
    this.customerId = params.customerId;
    this.extraSms = params.extraSms || 0;
    this.limitsOverrides = params.limitsOverrides ? new PlanLimitsOverrides(params.limitsOverrides, false) : null;
    this.limits = new PlanLimits(
      {
        cpuSeconds: this.limitsOverrides?.cpuSeconds || params.limits.cpuSeconds,
        smsCount: (this.limitsOverrides?.smsCount || params.limits.smsCount || 0) + this.extraSms,
      },
      false
    );
    this.billing = params.billing ? new PlanBilling(params.billing, false) : null;
    this.planId = params.planId;
    this.name = getPrettyName(params.planId);
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  customerId: string | null;

  @IsInstance(PlanLimits)
  @ValidateNested()
  limits: PlanLimitsInterface;

  @IsOptional()
  @IsInstance(PlanLimitsOverrides)
  @ValidateNested()
  limitsOverrides: PlanLimitsOverridesInterface | null;

  @IsEnum(PLAN_IDS)
  planId: PLAN_IDS;

  @Min(0)
  @IsInt()
  extraSms: number;

  @IsEnum(PLAN_STATUS)
  status: PLAN_STATUS;

  @IsOptional()
  @IsInstance(PlanBilling)
  @ValidateNested()
  billing: PlanBillingInterface | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  /**
   * Clean out sensitive items
   * @returns {object}
   */
  clean(): object {
    return omit(this, ['billing.subscriptionId', 'billing.subscriptionItemId', 'billing.customerId']);
  }

  /**
   * Generate id
   * @param {string} projectId
   * @returns {string}
   */
  static generateId(projectId: string): string {
    return CONSTANTS.ID_PREFIX + projectId;
  }

  /**
   * Get data to be pushed to the db
   * @param {DeepPartial<Plan>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<ProjectPlan>): object {
    return omit(instance, CONSTANTS.OMITTED_DB_PROPERTIES);
  }

  /**
   * Stringify object
   * @param {Plan} instance
   * @returns {string}
   */
  static stringifyForCache(instance: ProjectPlan): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {Plan}
   */
  static fromJson(object): ProjectPlan {
    const { createdAt, updatedAt, billing, ...rest } = object;
    return new ProjectPlan({
      ...rest,
      billing: billing ? PlanBilling.fromJson(billing) : null,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
      updatedAt: DateTime.fromISO(updatedAt).toJSDate(),
    });
  }

  /**
   * Parse from cache
   * @param {string} stringified
   * @returns {Plan}
   */
  static parseFromCache(stringified: string): ProjectPlan {
    return ProjectPlan.fromJson(JSON.parse(stringified));
  }
}
