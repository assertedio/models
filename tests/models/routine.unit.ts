import { expect } from 'chai';

import { Routine } from '../../src/models';

describe('routine config unit tests', () => {
  it('minimal create', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
    };

    const routineConfig = new Routine(params);

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
    };

    expect(routineConfig).to.eql(expected);
  });

  it('minimal create with empty mocha array', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      mocha: {
        files: [],
      },
    };

    const routineConfig = new Routine(params as any);

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
    } as any;

    const routineConfig = new Routine(params);

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
    };

    expect(routineConfig).to.eql(expected);
  });

  it('throw if missing id', () => {
    const params = {
      name: 'something',
      projectId: 'project-id',
    } as any;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const throws = () => new Routine(params);

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
    const throws = () => new Routine(params);

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
    const throws = () => new Routine(params);

    expect(throws).to.throw('interval.value must not be less than 1');
  });
});
