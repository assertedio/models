import { ValidatedBase } from 'validated-base';
import { ArrayMinSize, IsArray, IsInstance, ValidateNested } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { PackageFile, PackageFileConstructorInterface, PackageFileInterface } from './packageFile';

interface PackageUpdateInterface {
  files: PackageFileInterface[];
}

interface PackageUpdateConstructorInterface {
  files: PackageFileConstructorInterface[];
}

/**
 * @class
 */
export class PackageUpdate extends ValidatedBase implements PackageUpdateInterface {
  /**
   * @param {PackageUpdateConstructorInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: PackageUpdateConstructorInterface, validate = false) {
    super();

    this.files = (params.files || []).map((file) => new PackageFile(file));

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
  @IsInstance(PackageFile, { each: true })
  files: PackageFileInterface[];
}
