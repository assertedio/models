import { IsDate, IsEnum, IsString } from 'class-validator';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';
import { DeepPartial } from 'ts-essentials';

import { enumError, toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export enum PROJECT_ROLE {
  OWNER = 'owner',
  MEMBER = 'member',
}

export interface CreateProjectMembership {
  projectId: string;
  userId: string;
  role: PROJECT_ROLE;
}

export interface ProjectMembershipInterface extends CreateProjectMembership {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const CONSTANTS = {
  ID_PREFIX: 'pm-',
};

/**
 * @class
 */
export class ProjectMembership extends ValidatedBase implements ProjectMembershipInterface {
  /**
   * @param {ProjectMembershipInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: ProjectMembershipInterface, validate = true) {
    super();

    this.id = params.id;
    this.projectId = params.projectId;
    this.userId = params.userId;
    this.role = params.role;
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

  @IsString()
  userId: string;

  @IsEnum(PROJECT_ROLE, { message: enumError(PROJECT_ROLE) })
  role: PROJECT_ROLE;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  /**
   * Create instance
   *
   * @param {CreateProjectMembership} params
   * @param {Date} [curDate]
   * @returns {ProjectMembership}
   */
  static create(params: CreateProjectMembership, curDate = DateTime.utc().toJSDate()): ProjectMembership {
    const computedProperties = {
      id: ProjectMembership.generateId(params.userId, params.projectId),
      createdAt: curDate,
      updatedAt: curDate,
    };

    return new ProjectMembership({ ...params, ...computedProperties });
  }

  /**
   * Generate ID for membership
   *
   * @param {string} userId
   * @param {string} projectId
   * @returns {string}
   */
  static generateId(userId: string, projectId: string): string {
    return `${CONSTANTS.ID_PREFIX}${shorthash.unique(userId)}${shorthash.unique(projectId)}`;
  }

  /**
   * Get data to be pushed to the db
   *
   * @param {DeepPartial<Project>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<ProjectMembership>): object {
    return instance;
  }

  /**
   * Stringify object
   *
   * @param {Project} instance
   * @returns {string}
   */
  static stringifyForCache(instance: ProjectMembership): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   *
   * @param {object} object
   * @returns {Project}
   */
  static fromJson(object): ProjectMembership {
    const { createdAt, updatedAt, ...rest } = object;
    return new ProjectMembership({
      ...rest,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
      updatedAt: DateTime.fromISO(updatedAt).toJSDate(),
    });
  }

  /**
   * Parse from cache
   *
   * @param {string} stringified
   * @returns {Project}
   */
  static parseFromCache(stringified: string): ProjectMembership {
    return ProjectMembership.fromJson(JSON.parse(stringified));
  }
}
