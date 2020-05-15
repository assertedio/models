import { expect } from 'chai';
import { DateTime } from 'luxon';

import { CompletedRunRecord, DEPENDENCIES_VERSIONS, Routine, RUN_STATUS } from '../../src/models';
import { TIMELINE_EVENT_STATUS, TimelineEvent, TimelineEventConstructorInterface } from '../../src/models/timelineEvent';
import { RoutineStatus, RoutineStatusConstructorInterface, RUN_TYPE } from '../../src/requests';

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
        incomplete: 0,
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
      dependencies: DEPENDENCIES_VERSIONS.V1,
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
      start: curDate,
      end: curDate,
      projectId: 'project-id',
      routineId: 'routine-id',
      status: TIMELINE_EVENT_STATUS.UP,
    };

    const timelineEvent = new TimelineEvent(timelineParams);

    const stats = {
      passes: 1,
      failures: 1,
      total: 1,
    };

    const uptime = {
      routineId: 'rout-id',
      window: 'week' as any,
      start: curDate,
      end: curDate,
      tests: stats,
      runs: stats,
    };

    const params: Omit<RoutineStatusConstructorInterface, 'overallStatus' | 'nextRunAt'> = {
      record: completeRunRecord,
      status: timelineEvent,
      downtime: timelineEvent,
      uptimes: {
        day: uptime,
        week: uptime,
        month: uptime,
      },
    };

    const routineStatus = RoutineStatus.create(routine, params);

    const expected = {
      overallStatus: 'notPushed',
      nextRunAt: null,
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
          incomplete: 0,
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
        id: 'te-Z1p3VEg',
        start: curDate,
        end: curDate,
        projectId: 'project-id',
        routineId: 'routine-id',
        durationMs: 0,
        status: 'up',
      },
      downtime: {
        id: 'te-Z1p3VEg',
        start: curDate,
        end: curDate,
        projectId: 'project-id',
        routineId: 'routine-id',
        durationMs: 0,
        status: 'up',
      },
      uptimes: {
        day: {
          window: 'week',
          routineId: 'rout-id',
          tests: {
            availability: 0.5,
            failures: 1,
            passes: 1,
            total: 2,
          },
          runs: {
            availability: 0.5,
            failures: 1,
            passes: 1,
            total: 2,
          },
          start: curDate,
          end: curDate,
        },
        week: {
          window: 'week',
          routineId: 'rout-id',
          tests: {
            availability: 0.5,
            failures: 1,
            passes: 1,
            total: 2,
          },
          runs: {
            availability: 0.5,
            failures: 1,
            passes: 1,
            total: 2,
          },
          start: curDate,
          end: curDate,
        },
        month: {
          window: 'week',
          routineId: 'rout-id',
          tests: {
            availability: 0.5,
            failures: 1,
            passes: 1,
            total: 2,
          },
          runs: {
            availability: 0.5,
            failures: 1,
            passes: 1,
            total: 2,
          },
          start: curDate,
          end: curDate,
        },
      },
    };

    expect(routineStatus).to.eql(expected);
  });

  it('set overall status', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const timelineParams: TimelineEventConstructorInterface = {
      start: curDate,
      end: curDate,
      projectId: 'project-id',
      routineId: 'routine-id',
      status: TIMELINE_EVENT_STATUS.UP,
    };

    const timelineEvent = new TimelineEvent(timelineParams);

    expect(RoutineStatus.getOverallStatus({ hasPackage: false, enabled: false } as any, null)).to.eql('notPushed');
    expect(RoutineStatus.getOverallStatus({ hasPackage: true, enabled: false } as any, null)).to.eql('disabled');
    expect(RoutineStatus.getOverallStatus({ hasPackage: true, enabled: true } as any, null)).to.eql('noRecords');
    expect(RoutineStatus.getOverallStatus({ hasPackage: true, enabled: true } as any, timelineEvent)).to.eql('up');
  });
});
