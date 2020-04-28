import { expect } from 'chai';
import { IsString } from 'class-validator';

import { ValidatedBase } from '../../src';
import { ListResponse } from '../../src/requests/listResponse';

class TestClass extends ValidatedBase {
  constructor(params) {
    super();
    this.foo = params.foo;
    this.validate();
  }

  @IsString()
  foo: string;
}

describe('list response', () => {
  it('create', () => {
    const params = {
      list: [{ foo: 'bar' }, { foo: 'yo' }],
      nextAfter: '2018-01-01T00:00:00.000Z',
      prevBefore: '2018-01-01T00:00:00.000Z',
    };

    const listResponse = new ListResponse(params, TestClass);

    const expected = {
      list: [{ foo: 'bar' }, { foo: 'yo' }],
      nextAfter: new Date('2018-01-01T00:00:00.000Z'),
      prevBefore: new Date('2018-01-01T00:00:00.000Z'),
    };

    expect(listResponse).to.eql(expected);
  });
});
