import { ValidatedBase } from 'validated-base';
import { Allow, IsString, IsDate } from 'class-validator';
import { DateTime } from 'luxon';
import shorthash from 'shorthash';
import { toDate } from '../utils';

export interface BuildInterface {
  id: string;
  packageJson: Record<string, any>;
  shrinkwrapJson: Record<string, any> | null;
  createdAt: Date;
}

export interface BuildConstructorInterface extends Omit<BuildInterface, 'createdAt'> {
  createdAt: string | Date;
}

const CONSTANTS = {
  ID_PREFIX: 'pj-',
};

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
   * Generate ID
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
