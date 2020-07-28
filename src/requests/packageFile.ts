import shorthash from 'shorthash';
import { IsString } from 'class-validator';

import { ValidatedBase } from 'validated-base';

export interface PackageFileInterface {
  contents: string;
  hash: string;
}

/**
 * @class
 */
export class PackageFile extends ValidatedBase implements PackageFileInterface {
  /**
   * @param {DebugRoutineInterface} params
   * @param {boolean} validate
   */
  constructor(params: Omit<PackageFileInterface, 'hash'>, validate = true) {
    super();

    this.contents = params.contents;
    this.hash = PackageFile.getHash(this.contents);

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  contents: string;

  @IsString()
  hash: string;

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
