import { IsDate, IsEnum, IsInstance, IsOptional, IsString, ValidateNested } from 'class-validator';
import { omit, startCase } from 'lodash';
import { DateTime } from 'luxon';
import { DeepPartial } from 'ts-essentials';

import { enumError, toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';
import { Limits, LimitsInterface, PlanLimitsOverrides, PlanLimitsOverridesInterface } from './limits';
import { Payment, PaymentInterface } from './payment';
import { Subscription, SubscriptionInterface } from './subscription';

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
  customerId: string | null;
  payment: PaymentInterface | null;
  subscription: SubscriptionInterface | null;
  limits: LimitsInterface;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageAndLimitInterface {
  planUsed: number;
  extraRemaining: number;
  limit: number;
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
    this.limitsOverrides = params.limitsOverrides ? new PlanLimitsOverrides(params.limitsOverrides, false) : null;
    this.limits = new Limits(
      {
        cpuSeconds: this.limitsOverrides?.cpuSeconds || params.limits.cpuSeconds,
        smsCount: this.limitsOverrides?.smsCount || params.limits.smsCount || 0,
      },
      false
    );
    this.payment = params.payment ? new Payment(params.payment, false) : null;
    this.subscription = params.subscription ? new Subscription(params.subscription, false) : null;
    this.planId = params.planId;
    this.name = getPrettyName(params.planId);
    this.status = params.status;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);

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

  @IsInstance(Limits)
  @ValidateNested()
  limits: LimitsInterface;

  @IsOptional()
  @IsInstance(PlanLimitsOverrides)
  @ValidateNested()
  limitsOverrides: PlanLimitsOverridesInterface | null;

  @IsEnum(PLAN_IDS, { message: enumError(PLAN_IDS) })
  planId: PLAN_IDS;

  @IsEnum(PLAN_STATUS, { message: enumError(PLAN_STATUS) })
  status: PLAN_STATUS;

  @IsOptional()
  @IsInstance(Payment)
  @ValidateNested()
  payment: PaymentInterface | null;

  @IsOptional()
  @IsInstance(Subscription)
  @ValidateNested()
  subscription: SubscriptionInterface | null;

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
      payment: billing ? Payment.fromJson(billing) : null,
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
