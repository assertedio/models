import { IsDate, IsEnum, IsInstance, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { omit } from 'lodash';
import { DeepPartial } from 'ts-essentials';

import { enumError, ValidatedBase } from 'validated-base';
import { toDate } from '../../utils';
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
  planId: string;
  quantity: number;
  status: PLAN_STATUS;
  payment: PaymentInterface | null;
  subscription: SubscriptionInterface | null;
  limits: LimitsInterface;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageAndLimitInterface {
  sms: {
    planUsed: number;
    extraRemaining: number;
    limit: number;
  };
  routines: {
    count: number;
    limit: number;
  };
  seconds: {
    allocated: number;
    limit: number;
  };
}

const CONSTANTS = {
  ID_PREFIX: 'pl-',
};

export interface InvoiceInterface {
  created: string | null;
  due: string | null;
  amount: number;
  status: string;
  link: string | null;
  pdf: string | null;
}

export interface ProjectPlanConstructorInterface extends Omit<ProjectPlanInterface, 'quantity'> {
  quantity?: number;
}

/**
 * @class
 */
export class ProjectPlan extends ValidatedBase implements ProjectPlanInterface {
  static CONSTANTS = CONSTANTS;

  /**
   * @param {ProjectPlanInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: ProjectPlanConstructorInterface, validate = true) {
    super();

    this.id = params.id;
    this.projectId = params.projectId;
    this.quantity = params.quantity || 1;
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
  projectId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

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
   *
   * @returns {object}
   */
  clean(): Record<string, any> {
    return omit(this, ['subscription.subscriptionId', 'subscription.subscriptionItemId', 'payment.customerId']);
  }

  /**
   * Generate id
   *
   * @param {string} projectId
   * @returns {string}
   */
  static generateId(projectId: string): string {
    return CONSTANTS.ID_PREFIX + projectId;
  }

  /**
   * Get data to be pushed to the db
   *
   * @param {DeepPartial<Plan>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<ProjectPlan>): Record<string, any> {
    return omit(instance, 'limits');
  }

  /**
   * Stringify object
   *
   * @param {Plan} instance
   * @returns {string}
   */
  static stringifyForCache(instance: ProjectPlan): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   *
   * @param {object} object
   * @returns {Plan}
   */
  static fromJson(object): ProjectPlan {
    return new ProjectPlan(object);
  }

  /**
   * Parse from cache
   *
   * @param {string} stringified
   * @returns {Plan}
   */
  static parseFromCache(stringified: string): ProjectPlan {
    return ProjectPlan.fromJson(JSON.parse(stringified));
  }
}
