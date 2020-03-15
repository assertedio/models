import { expect } from 'chai';

import { RUNNERS, Summary } from '../../src/requests';

describe('summary unit tests', () => {
  it('create', () => {
    const params = {
      failures: [
        {
          actual: 'something',
          expected: 'not-something',
          message: 'it broke yo',
          stack: 'big stacks',
          title: 'some-title',
          duration: 0,
        },
      ],
      passes: [
        {
          title: 'something',
          duration: 12,
        },
      ],
      errorType: null,
      runner: RUNNERS.MOCHA,
      console: null,
      stats: {
        duration: 100,
        failures: 1,
        passes: 1,
        pending: 0,
        suites: 2,
        tests: 2,
      },
    };

    const summary = new Summary(params);

    expect(summary).to.eql(params);
  });
});
