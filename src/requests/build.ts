import { ValidatedBase } from 'validated-base';
import { Allow, IsString, IsDate } from 'class-validator';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';
import { isString, isObject } from 'lodash';
import { toDate } from '../utils';

export interface DependenciesInterface {
  packageJson: Record<string, any>;
  shrinkwrapJson: Record<string, any> | null;
}

export const isDependenciesObject = (input: any): input is DependenciesInterface => {
  return isObject(input?.packageJson) && (input?.shrinkwrapJson === null || isObject(input?.shrinkwrapJson));
};

export interface BuildInterface extends DependenciesInterface {
  id: string;
  createdAt: Date;
}

export interface BuildConstructorInterface extends Omit<BuildInterface, 'createdAt'> {
  createdAt: string | Date;
}

const CONSTANTS = {
  ID_PREFIX: 'db-',
};

const isDependencyBuildId = (input: string): boolean => isString(input) && input.startsWith(CONSTANTS.ID_PREFIX);

/**
 * @class
 */
export class Build extends ValidatedBase implements BuildInterface {
  static CONSTANTS = CONSTANTS;

  /**
   * @param {BuildConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: BuildConstructorInterface, validate = true) {
    super();

    this.id = params.id;
    this.packageJson = params.packageJson;
    this.shrinkwrapJson = params.shrinkwrapJson;
    this.createdAt = toDate(params.createdAt);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @Allow()
  packageJson: Record<string, any>;

  @Allow()
  shrinkwrapJson: Record<string, any> | null;

  @IsDate()
  createdAt: Date;

  /**
   * Generate ID based on dependencies and shrinkwrapped dependencies
   *
   * @param {Record<string, any>} packageJson
   * @param {Record<string, any>} shrinkwrapJson
   * @returns {string}
   */
  static generateId(packageJson: Record<string, any>, shrinkwrapJson: Record<string, any> | null): string {
    const { dependencies = {} } = packageJson;
    const { dependencies: shrinkwrapDependencies = {} } = shrinkwrapJson || {};

    return CONSTANTS.ID_PREFIX + shorthash.unique(JSON.stringify(dependencies) + JSON.stringify(shrinkwrapDependencies));
  }

  /**
   * Create model instance
   *
   * @param {Omit<BuildInterface, 'id' | 'createdAt'>} params
   * @param {Date} curDate
   * @returns {Build}
   */
  static create(params: Omit<BuildInterface, 'id' | 'createdAt'>, curDate = DateTime.utc().toJSDate()): Build {
    return new Build({
      ...params,
      id: Build.generateId(params.packageJson, params.shrinkwrapJson),
      createdAt: curDate,
    });
  }
}
