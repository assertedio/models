import { IsDate, IsString, MaxLength } from 'class-validator';
import { DateTime } from 'luxon';
import shortid from 'shortid';
import { DeepPartial } from 'ts-essentials';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

/**
 * @interface
 */
export interface CreateProjectInterface {
  name: string;
}

/**
 * @interface
 */
export interface ProjectInterface extends CreateProjectInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const CONSTANTS = {
  ID_PREFIX: 'p-',
  MAX_NAME_LENGTH: 30,
};

/**
 * @class
 */
export class Project extends ValidatedBase implements ProjectInterface {
  static readonly CONSTANTS = { ...CONSTANTS };

  /**
   * @param {ProjectInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: ProjectInterface, validate = true) {
    super();

    this.id = params.id;
    this.name = Project.cleanName(params.name || '');
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @MaxLength(CONSTANTS.MAX_NAME_LENGTH)
  @IsString()
  name: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  updatedAt: Date;

  /**
   * Clean name string
   * @param {string} input
   * @returns {string}
   */
  static cleanName(input: string): string {
    return input.replace(/\s+/g, ' ');
  }

  /**
   * Create instance of model
   * @param {CreateProjectInterface} params
   * @param {Date} [curDate=new Date()]
   * @returns {Project}
   */
  static create(params: CreateProjectInterface, curDate = DateTime.utc().toJSDate()): Project {
    const computedProperties = {
      id: CONSTANTS.ID_PREFIX + shortid.generate(),
      createdAt: curDate,
      updatedAt: curDate,
    };

    return new Project({ ...params, ...computedProperties });
  }

  /**
   * Get data to be pushed to the db
   * @param {DeepPartial<Project>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<Project>): object {
    return instance;
  }

  /**
   * Stringify object
   * @param {Project} instance
   * @returns {string}
   */
  static stringifyForCache(instance: Project): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {Project}
   */
  static fromJson(object): Project {
    const { createdAt, updatedAt, ...rest } = object;
    return new Project({
      ...rest,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
      updatedAt: DateTime.fromISO(updatedAt).toJSDate(),
    });
  }

  /**
   * Parse from cache
   * @param {string} stringified
   * @returns {Project}
   */
  static parseFromCache(stringified: string): Project {
    return Project.fromJson(JSON.parse(stringified));
  }
}
