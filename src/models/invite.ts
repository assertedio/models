import { IsDate, IsEmail, IsString } from 'class-validator';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';
import { DeepPartial } from 'ts-essentials';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export interface CreateInviteInterface {
  projectId: string;
  sendTo: string;
}

export interface InviteInterface extends CreateInviteInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const CONSTANTS = {
  ID_PREFIX: 'iv-',
};

/**
 * @class
 */
export class Invite extends ValidatedBase implements InviteInterface {
  static readonly CONSTANTS = CONSTANTS;

  /**
   * @param {InviteInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: InviteInterface, validate = true) {
    super();

    this.id = params.id;
    this.projectId = params.projectId;
    this.sendTo = params.sendTo;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsString()
  readonly projectId: string;

  @IsEmail()
  readonly sendTo: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  /**
   * Create instance
   *
   * @param {CreateInviteInterface} params
   * @param {Date} [curDate]
   * @returns {Invite}
   */
  static create(params: CreateInviteInterface, curDate: Date = DateTime.utc().toJSDate()): Invite {
    const computedProperties = {
      id: Invite.generateId(params),
      createdAt: curDate,
      updatedAt: curDate,
    };

    return new Invite({ ...params, ...computedProperties });
  }

  /**
   * Generate ID based on orgId and integration name
   *
   * @param {object} params
   * @param {string} params.projectId
   * @returns {string}
   */
  static generateId({ projectId, sendTo }: { projectId: string; sendTo: string }): string {
    return `${CONSTANTS.ID_PREFIX}${shorthash.unique(projectId + sendTo)}`;
  }

  /**
   * Get data to be pushed to the db
   *
   * @param {DeepPartial<Invite>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<Invite>): object {
    return instance;
  }

  /**
   * Stringify object
   *
   * @param {Invite} instance
   * @returns {string}
   */
  static stringifyForCache(instance: Invite): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   *
   * @param {object} object
   * @returns {Invite}
   */
  static fromJson(object): Invite {
    const { createdAt, updatedAt, ...rest } = object;
    return new Invite({
      ...rest,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
      updatedAt: DateTime.fromISO(updatedAt).toJSDate(),
    });
  }

  /**
   * Parse from cache
   *
   * @param {string} stringified
   * @returns {Invite}
   */
  static parseFromCache(stringified: string): Invite {
    return Invite.fromJson(JSON.parse(stringified));
  }
}
