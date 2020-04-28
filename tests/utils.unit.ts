import { expect } from 'chai';
import { IsEnum } from 'class-validator';

import { ValidatedBase } from '../src';
import { enumError } from '../src/utils';

describe('utils unit tests', () => {
  it('get enum error message', () => {
    enum Something {
      first = 'first',
      second = 'second',
    }

    class WithEnum extends ValidatedBase {
      constructor(params: any) {
        super();
        this.something = params.something;
        this.validate();
      }

      @IsEnum(Something, { message: enumError(Something) })
      something: Something;
    }

    expect(() => new WithEnum({ something: 'yo' })).to.throw('something must be one of: first, second');
  });
});
