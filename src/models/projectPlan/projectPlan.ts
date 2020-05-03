import { IsDate, IsEnum, IsInstance, IsOptional, IsString, ValidateNested } from 'class-validator';
import { omit } from 'lodash';
import { DateTime } from 'luxon';
import { DeepPartial } from 'ts-essentials';

import { enumError, toDate } from '../../utils';
import { ValidatedBase } from '../../validatedBase';
import { Limits, LimitsInterface, PlanLimitsOverrides, PlanLimitsOverridesInterface } from './limits';
import { Payment, PaymentInterface } from './payment';
import { Subscription, SubscriptionInterface } from './subscription';

export enum PLAN_STATUS {
  FAILED_PAYMENT = 'failedPayment',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export interface CreateProjectPlanInterface {
  projectId: string;
  limitsOverrides: PlanLimitsOverridesInterface | null;
}

export interface ProjectPlanInterface extends CreateProjectPlanInterface {
  id: string;
  name: string;
  planId: string;
  status: PLAN_STATUS;
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
export class ProjectPlan extends ValidatedBase implements ProjectPlanInterface {
  static CONSTANTS = CONSTANTS;

  /**
   * @param {ProjectPlanInterface} params
   * @param {boolean} validate=true
   */
  constructor(params: ProjectPlanInterface, validate = true) {
    super();

    this.id = params.id;
    this.projectId = params.projectId;
    this.limitsOverrides = params.limitsOverrides ? new PlanLimitsOverrides(params.limitsOverrides, false) : null;
    this.limits = new Limits(
      {
        cpuSeconds: this.limitsOverrides?.cpuSeconds || params.limits.cpuSeconds,
        smsCount: this.limitsOverrides?.smsCount || params.limits.smsCount || 0,
        routines: this.limitsOverrides?.routines || params.limits.routines || 1,
      },
      false
    );
    this.payment = params.payment ? new Payment(params.payment, false) : null;
    this.subscription = params.subscription ? new Subscription(params.subscription, false) : null;
    this.planId = params.planId;
    this.name = params.name;
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

  @IsInstance(Limits)
  @ValidateNested()
  limits: LimitsInterface;

  @IsOptional()
  @IsInstance(PlanLimitsOverrides)
  @ValidateNested()
  limitsOverrides: PlanLimitsOverridesInterface | null;

  @IsString()
  planId: string;

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
