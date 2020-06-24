import { expect } from 'chai';

import { TEST_EVENT_TYPES, TestEvent } from '../../src/requests/testEvent';

describe('testEvent unit tests', () => {
  it('create', () => {
    const params = {
      data: {
        type: TEST_EVENT_TYPES.EVENT_RUN_END,
        duration: null,
        error: null,
        file: null,
        fullTitle: null,
        fullTitlePath: [],
        id: null,
        result: null,
        root: false,
        timedOut: false,
        title: null,
      },
      timestamp: new Date('2018-01-01T00:00:00.000Z'),
      stats: {
        suites: 1,
        tests: 1,
        passes: 1,
        incomplete: 0,
        pending: 0,
        failures: 0,
        start: new Date('2018-01-01T00:00:00.000Z'),
        end: new Date('2018-01-01T00:00:00.000Z'),
        duration: null,
      },
      elapsedMs: 0,
    };

    const testEvent = new TestEvent(params);

    expect(testEvent).to.eql(params);
  });

  it('create with number error code', () => {
    const params = {
      data: {
        type: TEST_EVENT_TYPES.EVENT_RUN_END,
        duration: null,
        error: {
          code: 303,
          diff: undefined,
          fullTitle: undefined,
          message: undefined,
          stack: null,
        },
        file: null,
        fullTitle: null,
        fullTitlePath: [],
        id: null,
        result: null,
        root: false,
        timedOut: false,
        title: null,
      },
      timestamp: new Date('2018-01-01T00:00:00.000Z'),
      stats: {
        suites: 1,
        tests: 1,
        passes: 1,
        incomplete: 0,
        pending: 0,
        failures: 0,
        start: new Date('2018-01-01T00:00:00.000Z'),
        end: new Date('2018-01-01T00:00:00.000Z'),
        duration: null,
      },
      elapsedMs: 0,
    };

    const testEvent = new TestEvent(params);

    expect(testEvent).to.eql(params);
  });
});
