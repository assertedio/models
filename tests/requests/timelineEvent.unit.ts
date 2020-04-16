import { expect } from 'chai';

import { TIMELINE_EVENT_STATUS, TimelineEvent } from '../../src/requests/timelineEvent';

describe('timeline event unit tests', () => {
  it('create timeline event', () => {
    const params = {
      start: '2018-01-01T00:00:00.000Z',
      end: '2018-01-01T00:00:00.000Z',
      status: TIMELINE_EVENT_STATUS.UP,
      records: [],
    };

    const timeline = new TimelineEvent(params);

    const expected = {
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: new Date('2018-01-01T00:00:00.000Z'),
      durationSec: 0,
      status: TIMELINE_EVENT_STATUS.UP,
      records: [],
    };

    expect(timeline).to.eql(expected);
  });
});
