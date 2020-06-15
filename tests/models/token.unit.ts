import { expect } from 'chai';
import { isString, omit } from 'lodash';
import { DateTime } from 'luxon';

import { Token } from '../../src/models/token';

describe('token unit tests', () => {
  it('created instance of token', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const created = Token.create({ userId: 'user-id' }, curDate);

    expect(isString(created.token.id)).to.eql(true);
    expect(isString(created.token.name)).to.eql(true);
    expect(omit(created.token, ['id', 'name'])).to.eql({ lastUsedAt: null, createdAt: curDate, updatedAt: curDate, userId: 'user-id' });
  });

  it('to and from json', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const created = new Token({ userId: 'user-id', createdAt: curDate, lastUsedAt: curDate, updatedAt: curDate, id: 'foo', name: 'some-name' });

    expect(created).to.eql({ userId: 'user-id', createdAt: curDate, lastUsedAt: curDate, updatedAt: curDate, id: 'foo', name: 'some-name' });
    expect(Token.fromJson(JSON.parse(JSON.stringify(created)))).to.eql(created);
  });
});
