import shorthash from 'shorthash';
import { isString } from 'lodash';
import normalize from 'normalize-path';
import isValidPath from 'is-valid-path';
import { IsString, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { ValidatedBase } from 'validated-base';

const STARTS_RELATIVE_PATH = /^\.+\/+/;

export interface PackageFileInterface {
  contents: string;
  hash: string;
  path: string;
}

export type PackageFileConstructorInterface = Omit<PackageFileInterface, 'hash'>;

const isOutsideDir = (filePath: string) => filePath.match(STARTS_RELATIVE_PATH);

export const validFilePath = (filePath: any): boolean =>
  isString(filePath) && isValidPath(filePath) && !isOutsideDir(filePath) && !filePath.endsWith('/');

/* eslint-disable require-jsdoc, class-methods-use-this */

@ValidatorConstraint({ name: 'filePath', async: false })
export class FilePathValidator implements ValidatorConstraintInterface {
  validate(value: any): Promise<boolean> | boolean {
    return validFilePath(value);
  }

  defaultMessage(): string {
    return 'Must be a valid path within the .asserted directory. No relative prefix.';
  }
}

/* eslint-enable require-jsdoc, class-methods-use-this */

/**
 * @class
 */
export class PackageFile extends ValidatedBase implements PackageFileInterface {
  /**
   * @param {DebugRoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: PackageFileConstructorInterface, validate = true) {
    super();

    this.contents = params.contents;
    this.hash = PackageFile.getHash(this.contents);
    this.path = normalize(params.path, false);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  contents: string;

  @IsString()
  hash: string;

  @Validate(FilePathValidator)
  path: string;

  /**
   * Get hash of contents
   *
   * @param {string} contents
   * @returns {string}
   */
  static getHash(contents: string): string {
    return shorthash.unique(contents);
  }
}
