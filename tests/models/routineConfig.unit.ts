import { expect } from 'chai';

import { INTERVAL_UNITS, RoutineConfig } from '../../src/models';

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
      dependencies: 'v1',
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

  it('get required seconds - typical', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: INTERVAL_UNITS.MIN,
        value: 5,
      },
      timeoutSec: 1,
    };

    const routineConfig = new RoutineConfig(params);

    expect(routineConfig.requiredSeconds()).to.eql(288);
  });

  it('get required seconds - hour', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: INTERVAL_UNITS.HR,
        value: 1,
      },
      timeoutSec: 1,
    };

    const routineConfig = new RoutineConfig(params);

    expect(routineConfig.requiredSeconds()).to.eql(24);
  });

  it('get required seconds - 2 hours', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: INTERVAL_UNITS.HR,
        value: 2,
      },
      timeoutSec: 1,
    };

    const routineConfig = new RoutineConfig(params);

    expect(routineConfig.requiredSeconds()).to.eql(12);
  });

  it('get required seconds - day interval', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: INTERVAL_UNITS.DAY,
        value: 1,
      },
      timeoutSec: 1,
    };

    const routineConfig = new RoutineConfig(params);

    expect(routineConfig.requiredSeconds()).to.eql(1);
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
      dependencies: 'v1',
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
      dependencies: 'v1',
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
      dependencies: 'v1',
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
      dependencies: 'v1',
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

  it('full create w custom', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      dependencies: 'custom',
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
      dependencies: 'custom',
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

    const throws = () => new RoutineConfig(params);

    expect(throws).to.throw('interval.value must not be less than 1');
  });
});
