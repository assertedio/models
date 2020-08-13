import { ValidatedBase } from 'validated-base';
import HTTP_STATUS from 'http-status';
import { ArrayMinSize, IsArray, IsInstance, IsString, ValidateNested } from 'class-validator';
import Err from 'err';
import { PackageFileUpdate, PackageFileUpdateInterface } from './packageFileUpdate';
import { PackagePatchConstructorInterface, PackagePatchInterface } from './packagePatch';

export interface RoutinePackagePatchInterface extends PackagePatchInterface {
  routineId: string;
}

export interface RoutinePackagePatchConstructorInterface extends PackagePatchConstructorInterface {
  routineId: string;
}

/**
 * @class
 */
export class RoutinePackagePatch extends ValidatedBase implements RoutinePackagePatchInterface {
  /**
   * @param {PackagePatchConstructorInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: RoutinePackagePatchConstructorInterface, validate = false) {
    super();

    this.routineId = params.routineId;
    this.files = (params.files || []).map((file) => new PackageFileUpdate(file));

    if (this.files.length === 0) {
      throw new Err('files must have a length greater than 0', HTTP_STATUS.BAD_REQUEST);
    }

    if (validate) {
      this.validate();
    }
  }

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsInstance(PackageFileUpdate, { each: true })
  files: PackageFileUpdateInterface[];

  @IsString()
  routineId: string;
}
