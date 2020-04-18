import { expect } from 'chai';
import { DateTime } from 'luxon';

import { CompletedRunRecord, Routine, RUN_STATUS } from '../../src/models';
import { TIMELINE_EVENT_STATUS, TimelineEvent, TimelineEventConstructorInterface } from '../../src/models/timelineEvent';
import { RoutineStatus, RUN_TYPE } from '../../src/requests';

describe('routine status unit', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const recordParams = {
      id: 'rs-run-id',
      status: RUN_STATUS.PASSED,
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'rn-run-id',
      type: RUN_TYPE.MANUAL,
      runDurationMs: 0,
      testDurationMs: 0,
      console: null,
      failType: null,
      timeoutType: null,
      error: null,
      results: [],
      stats: {
        duration: null,
        end: undefined,
        suites: 3,
        tests: 5,
        passes: 3,
        pending: 0,
        failures: 2,
        start: curDate,
      },
      completedAt: curDate,
    };

    const completeRunRecord = new CompletedRunRecord(recordParams);

    const routineParams = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      interval: {
        unit: 'hr' as any,
        value: 10,
      },
      mocha: {
        files: ['**/specific.asrtd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports' as any,
      },
      timeoutSec: 10,
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    };

    const routine = new Routine(routineParams);

    const timelineParams: TimelineEventConstructorInterface = {
      id: 'foo-id',
      start: curDate,
      end: curDate,
      projectId: 'project-id',
      routineId: 'routine-id',
      recordCount: 2,
      status: TIMELINE_EVENT_STATUS.UP,
      createdAt: curDate,
      updatedAt: curDate,
    };

    const timelineEvent = new TimelineEvent(timelineParams);

    const routineStatus = RoutineStatus.create(routine, timelineEvent, completeRunRecord);

    const expected = {
      overallStatus: 'notPushed',
      record: {
        id: 'rs-run-id',
        projectId: 'project-id',
        runId: 'rn-run-id',
        routineId: 'routine-id',
        stats: {
          suites: 3,
          tests: 5,
          passes: 3,
          pending: 0,
          failures: 2,
          start: curDate,
          end: undefined,
          duration: null,
        },
        runDurationMs: 0,
        testDurationMs: 0,
        type: 'manual',
        console: null,
        error: null,
        status: 'passed',
        failType: null,
        timeoutType: null,
        completedAt: curDate,
        results: [],
      },
      status: {
        id: 'foo-id',
        start: curDate,
        end: curDate,
        projectId: 'project-id',
        routineId: 'routine-id',
        recordCount: 2,
        durationMs: 0,
        status: 'up',
        createdAt: curDate,
        updatedAt: curDate,
      },
    };

    expect(routineStatus).to.eql(expected);
  });

  it('set overall status', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const timelineParams: TimelineEventConstructorInterface = {
      id: 'foo-id',
      start: curDate,
      end: curDate,
      projectId: 'project-id',
      routineId: 'routine-id',
      recordCount: 2,
      status: TIMELINE_EVENT_STATUS.UP,
      createdAt: curDate,
      updatedAt: curDate,
    };

    const timelineEvent = new TimelineEvent(timelineParams);

    expect(RoutineStatus.create({ hasPackage: false, enabled: false } as any, null, null).overallStatus).to.eql('notPushed');
    expect(RoutineStatus.create({ hasPackage: true, enabled: false } as any, null, null).overallStatus).to.eql('disabled');
    expect(RoutineStatus.create({ hasPackage: true, enabled: true } as any, null, null).overallStatus).to.eql('noRecords');
    expect(RoutineStatus.create({ hasPackage: true, enabled: true } as any, timelineEvent, null).overallStatus).to.eql('up');
  });
});
