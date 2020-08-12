import { ValidatedBase } from 'validated-base';
import { ArrayMinSize, IsArray, IsInstance, ValidateNested } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { PackageFileUpdate, PackageFileUpdateConstructorInterface, PackageFileUpdateInterface } from './packageFileUpdate';

interface PackagePatchInterface {
  files: PackageFileUpdateInterface[];
}

interface PackagePatchConstructorInterface {
  files: PackageFileUpdateConstructorInterface[];
}

/**
 * @class
 */
export class PackagePatch extends ValidatedBase implements PackagePatchInterface {
  /**
   * @param {PackagePatchConstructorInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: PackagePatchConstructorInterface, validate = false) {
    super();

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
}
