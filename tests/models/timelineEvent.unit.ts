import { expect } from 'chai';
import { DateTime } from 'luxon';

import { TIMELINE_EVENT_STATUS, TimelineEvent, TimelineEventConstructorInterface } from '../../src/models/timelineEvent';

describe('timeline event unit tests', () => {
  it('create event', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z');

    const params: TimelineEventConstructorInterface = {
      start: curDate.toJSDate(),
      end: curDate.plus({ day: 1 }).toJSDate(),
      projectId: 'project-id',
      routineId: 'routine-id',
      status: TIMELINE_EVENT_STATUS.UP,
      createdAt: curDate.toJSDate(),
      updatedAt: curDate.toJSDate(),
    };

    const timelineEvent = new TimelineEvent(params);

    const expected = {
      id: 'te-Z1p3VEg',
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: new Date('2018-01-02T00:00:00.000Z'),
      projectId: 'project-id',
      routineId: 'routine-id',
      durationMs: 86400000,
      status: 'up',
      createdAt: new Date('2018-01-01T00:00:00.000Z'),
      updatedAt: new Date('2018-01-01T00:00:00.000Z'),
    };

    expect(timelineEvent).to.eql(expected);
  });
});
