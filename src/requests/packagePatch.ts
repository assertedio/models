import { ValidatedBase } from 'validated-base';
import { ArrayMinSize, IsArray, IsInstance, ValidateNested } from 'class-validator';
import Err from 'err';
import HTTP_STATUS from 'http-status';
import { PackageFileUpdate, PackageFileUpdateConstructorInterface, PackageFileUpdateInterface } from './packageFileUpdate';
import { RoutineConfig } from '../models';

export interface PackagePatchInterface {
  files: PackageFileUpdateInterface[];
}

export interface PackagePatchConstructorInterface {
  files: PackageFileUpdateConstructorInterface[];
}

export const validatePackagePatchFiles = (files: PackageFileUpdateInterface[]) => {
  const packageJsonPatch = files.find(({ path }) => path === 'package.json');

  if (packageJsonPatch) {
    if (packageJsonPatch.contents === null) {
      throw new Err('Cannot delete package.json', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      JSON.parse(packageJsonPatch.contents);
    } catch {
      throw new Err('package.json contains invalid JSON', HTTP_STATUS.BAD_REQUEST);
    }
  }

  const routineJsonPatch = files.find(({ path }) => path === 'routine.json');

  if (routineJsonPatch) {
    if (routineJsonPatch.contents === null) {
      throw new Err('Cannot delete routine.json', HTTP_STATUS.BAD_REQUEST);
    }

    let parsed;

    try {
      parsed = JSON.parse(routineJsonPatch.contents);
    } catch {
      throw new Err('routine.json contains invalid JSON', HTTP_STATUS.BAD_REQUEST);
    }

    try {
      // Just validate config
      // eslint-disable-next-line no-new
      new RoutineConfig(parsed);
    } catch (error) {
      throw new Err(`Error in routine.json: ${error.message}`, HTTP_STATUS.BAD_REQUEST);
    }
  }
};

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
      validatePackagePatchFiles(this.files);
      this.validate();
    }
  }

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsInstance(PackageFileUpdate, { each: true })
  files: PackageFileUpdateInterface[];
}
