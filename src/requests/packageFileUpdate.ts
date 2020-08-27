import normalize from 'normalize-path';
import { isString } from 'lodash';
import { IsOptional, IsString, Validate } from 'class-validator';
import { ValidatedBase } from 'validated-base';
import { FilePathValidator, PackageFile } from './packageFile';

export interface PackageFileUpdateInterface {
  contents: string | null;
  hash: string | null;
  path: string;
}

export type PackageFileUpdateConstructorInterface = Omit<PackageFileUpdateInterface, 'hash'>;

/**
 * @class
 */
export class PackageFileUpdate extends ValidatedBase implements PackageFileUpdateInterface {
  /**
   * @param {PackageFileUpdateConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: PackageFileUpdateConstructorInterface, validate = true) {
    super();

    this.contents = params.contents;
    this.hash = isString(this.contents) ? PackageFile.getHash(this.contents) : null;
    this.path = normalize(params.path, false);

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsString()
  contents: string | null;

  @IsOptional()
  @IsString()
  hash: string | null;

  @Validate(FilePathValidator)
  path: string;
}
