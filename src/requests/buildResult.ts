import { ValidatedBase } from 'validated-base';
import { IsOptional, IsString } from 'class-validator';

export interface BuildResultInterface {
  id: string;
  console: string | null;
}

/**
 * @class
 */
export class BuildResult extends ValidatedBase implements BuildResultInterface {
  /**
   * @param {BuildResultInterface} params
   * @param {boolean} validate
   */
  constructor(params: BuildResultInterface, validate = true) {
    super();

    this.id = params.id;
    this.console = params.console || null;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  console: string | null;
}
