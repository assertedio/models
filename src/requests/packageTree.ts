import { IsInstance, IsString, ValidateNested } from 'class-validator';

import { ValidatedBase } from 'validated-base';

export interface PackageTreeFileInterface {
  path: string;
  hash: string;
}

/**
 * @class
 */
export class PackageTreeFile extends ValidatedBase implements PackageTreeFileInterface {
  /**
   * @param {PackageTreeFileInterface} params
   * @param {boolean} validate
   */
  constructor(params: PackageTreeFileInterface, validate = false) {
    super();

    this.hash = params.hash;
    this.path = params.path;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  hash: string;

  @IsString()
  path: string;
}

export interface PackageTreeInterface {
  tree: PackageTreeFileInterface[];
}

/**
 * @class
 */
export class PackageTree extends ValidatedBase implements PackageTreeInterface {
  /**
   * @param {PackageTreeInterface} params
   * @param {boolean} validate
   */
  constructor(params: PackageTreeInterface, validate = true) {
    super();

    this.tree = (params.tree || []).map((file) => new PackageTreeFile(file, false));

    if (validate) {
      this.validate();
    }
  }

  @ValidateNested({ each: true })
  @IsInstance(PackageTreeFile, { each: true })
  tree: PackageTreeFileInterface[];
}
