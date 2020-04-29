import { expect } from 'chai';
import { DateTime } from 'luxon';

import { Invite } from '../../src/models/invite';

const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

describe('invite unit tests', () => {
  it('create invite with valid email', async () => {
    const params = {
      projectId: 'project-id',
      sendTo: 'foo@bar.com',
    };

    const invite = Invite.create(params, curDate);

    await invite.validate();

    expect(invite.id.startsWith(Invite.CONSTANTS.ID_PREFIX)).to.eql(true);
    // @ts-ignore
    delete invite.id;
    expect(invite).to.eql({
      projectId: 'project-id',
      sendTo: 'foo@bar.com',
      createdAt: curDate,
      updatedAt: curDate,
    });
  });

  it('throws on invalid email', () => {
    expect(() =>
      Invite.create({
        projectId: 'project-id',
        sendTo: 'not-email',
      })
    ).to.throw('sendTo must be an email');
  });

  it('convert to and from cache version', () => {
    const params = {
      projectId: 'project-id',
      sendTo: 'foo@bar.com',
      identityId: null,
    };

    const invite = Invite.create(params, curDate);
    expect(Invite.parseFromCache(Invite.stringifyForCache(invite))).to.eql(invite);
  });

  it('convert to and from db version', () => {
    const params = {
      projectId: 'project-id',
      sendTo: 'foo@bar.com',
      identityId: null,
    };

    const invite = Invite.create(params, curDate);
    expect(new Invite(Invite.forDb(invite) as any)).to.eql(invite);
  });
});
