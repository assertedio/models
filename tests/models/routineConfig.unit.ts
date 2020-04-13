import { expect } from 'chai';

import { RoutineConfig } from '../../src/models';

describe('routine config unit tests', () => {
  it('minimal create', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
    };

    const routineConfig = new RoutineConfig(params);

    const expected = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      interval: {
        unit: 'min',
        value: 5,
      },
      mocha: {
        files: ['**/*.asrtd.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
      },
      timeoutSec: 1,
    };

    expect(routineConfig).to.eql(expected);
  });

  it('create with minimum interval', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: 'min' as any,
        value: 1,
      },
    };

    const routineConfig = new RoutineConfig(params);

    const expected = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      interval: {
        unit: 'min',
        value: 1,
      },
      mocha: {
        files: ['**/*.asrtd.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
      },
      timeoutSec: 1,
    };

    expect(routineConfig).to.eql(expected);
  });

  it('fail to create with minimum interval as string', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: 'min' as any,
        value: '1',
      },
    };

    expect(() => new RoutineConfig(params as any)).to.throw();
  });

  it('minimal create with empty mocha array', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      mocha: {
        files: [],
      },
    };

    const routineConfig = new RoutineConfig(params as any);

    const expected = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      interval: {
        unit: 'min',
        value: 5,
      },
      mocha: {
        files: ['**/*.asrtd.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
      },
      timeoutSec: 1,
    };

    expect(routineConfig).to.eql(expected);
  });

  it('full create', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      interval: {
        unit: 'hr',
        value: 10,
      },
      mocha: {
        files: ['**/specific.asrtd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports',
      },
      timeoutSec: 10,
    } as any;

    const routineConfig = new RoutineConfig(params);

    const expected = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      interval: {
        unit: 'hr',
        value: 10,
      },
      mocha: {
        files: ['**/specific.asrtd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports',
      },
      timeoutSec: 10,
    };

    expect(routineConfig).to.eql(expected);
  });

  it('throw if missing id', () => {
    const params = {
      name: 'something',
      projectId: 'project-id',
    } as any;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const throws = () => new RoutineConfig(params);

    expect(throws).to.throw('id must be a string');
  });

  it('throw if interval is not integer', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: 'hr',
        value: 1.23,
      },
    } as any;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const throws = () => new RoutineConfig(params);

    expect(throws).to.throw('interval.value must be an integer number');
  });

  it('throw if interval is less than 1', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: 'hr',
        value: 0,
      },
    } as any;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const throws = () => new RoutineConfig(params);

    expect(throws).to.throw('interval.value must not be less than 1');
  });
});