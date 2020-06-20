import { ValidatedBase } from 'validated-base';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { DateTime } from 'luxon';
import { toDate } from '../utils';

export interface BuildResultInterface {
  id: string;
  console: string | null;
  createdAt: Date;
  buildDurationMs: number;
}

/**
 * @class
 */
export class BuildResult extends ValidatedBase implements BuildResultInterface {
  /**
   * @param {BuildResultInterface} params
   * @param {boolean} validate
   */
  constructor(params: BuildResultInterface, validate = true) {
    super();

    this.id = params.id;
    this.console = params.console || null;
    this.createdAt = params.createdAt ? toDate(params.createdAt) : params.createdAt;
    this.buildDurationMs = params.buildDurationMs;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  console: string | null;

  @IsDate()
  createdAt: Date;

  @IsNumber()
  buildDurationMs: number;

  /**
   * Creat model instance
   *
   * @param {Omit<BuildResultInterface, 'createdAt'>} params
   * @param {Date} curDate
   * @returns {BuildResult}
   */
  static create(params: Omit<BuildResultInterface, 'createdAt'>, curDate = DateTime.utc().toJSDate()): BuildResult {
    return new BuildResult({
      ...params,
      createdAt: curDate,
    });
  }
}
