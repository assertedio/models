import { IsEnum, IsInstance, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { isNumber } from 'lodash';

import {
  DEPENDENCIES_VERSIONS,
  Interval,
  IntervalInterface,
  Mocha,
  MochaInterface,
  RoutineConfig,
  RoutineConfigConstructorInterface,
} from '../models/routineConfig';
import { cleanString, enumError } from '../utils';
import { ValidatedBase } from '../validatedBase';

export type CreateRoutineInterface = Omit<RoutineConfigConstructorInterface, 'id'>;

/**
 * @class
 */
export class CreateRoutine extends ValidatedBase implements CreateRoutineInterface {
  /**
   * @param {CreateRoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: CreateRoutineInterface, validate = true) {
    super();

    this.projectId = params?.projectId;
    this.name = params?.name ? cleanString(params?.name) : undefined;
    this.description = params?.description ? cleanString(params?.description) : undefined;
    this.interval = params?.interval ? new Interval(params.interval, false) : undefined;
    this.mocha = params?.mocha ? new Mocha(params.mocha, false) : undefined;
    this.timeoutSec = isNumber(params.timeoutSec) ? params.timeoutSec : undefined;
    this.dependencies = params.dependencies;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  projectId: string;

  @IsOptional()
  @MaxLength(RoutineConfig.CONSTANTS.NAME_MAX_LENGTH)
  @IsString()
  name?: string;

  @IsOptional()
  @MaxLength(RoutineConfig.CONSTANTS.DESCRIPTION_MAX_LENGTH)
  @IsString()
  description?: string;

  @ValidateNested()
  @IsOptional()
  @IsInstance(Interval)
  interval?: IntervalInterface;

  @ValidateNested()
  @IsOptional()
  @IsInstance(Mocha)
  mocha?: MochaInterface;

  @IsOptional()
  @Min(1)
  @Max(RoutineConfig.CONSTANTS.MAX_TIMEOUT_SEC, { message: RoutineConfig.CONSTANTS.MAX_TIMEOUT_ERROR })
  @IsInt()
  timeoutSec?: number;

  @IsOptional()
  @IsEnum(DEPENDENCIES_VERSIONS, { message: enumError(DEPENDENCIES_VERSIONS) })
  dependencies?: DEPENDENCIES_VERSIONS;
}
