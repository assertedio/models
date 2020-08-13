import { ValidatedBase } from 'validated-base';
import { IsOptional, IsString } from 'class-validator';

interface RoutinePackagePatchedInterface {
  routineId: string;
  error: string | null;
}

/**
 * @class
 */
export class RoutinePackagePatched extends ValidatedBase implements RoutinePackagePatchedInterface {
  /**
   * @param {RoutinePackagePatchedInterface} params
   * @param {boolean} validate
   */
  constructor(params: RoutinePackagePatchedInterface, validate = true) {
    super();

    this.routineId = params.routineId;
    this.error = params.error;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  routineId: string;

  @IsString()
  @IsOptional()
  error: string | null;
}
