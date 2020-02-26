import { expect } from 'chai';

import { RoutineConfig } from '../src';

describe('routine config unit tests', () => {
  it('minimal create', () => {
    const params = {
      id: 'something',
    };

    const routineConfig = new RoutineConfig.RoutineConfig(params);

    const expected = {
      id: 'something',
      name: '',
      description: '',
      frequency: {
        unit: 'min',
        value: 5,
      },
      files: ['**/*.astd.js'],
      ignore: [],
      prepushLocal: true,
      prepushOnce: true,
      mocha: {
        files: ['**/*.astd.js'],
        ignore: [],
        bail: false,
        ui: 'bbd',
      },
    };

    expect(routineConfig).to.eql(expected);
  });

  it('full create', () => {
    const params = {
      id: 'something',
      name: '',
      description: '',
      frequency: {
        unit: 'hr',
        value: 10,
      },
      files: ['**/*.astd.js'],
      ignore: ['!bin.js'],
      prepushLocal: true,
      prepushOnce: true,
      mocha: {
        files: ['**/specific.astd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports',
      },
    } as any;

    const routineConfig = new RoutineConfig.RoutineConfig(params);

    const expected = {
      id: 'something',
      name: '',
      description: '',
      frequency: {
        unit: 'hr',
        value: 10,
      },
      files: ['**/*.astd.js'],
      ignore: ['!bin.js'],
      prepushLocal: true,
      prepushOnce: true,
      mocha: {
        files: ['**/specific.astd.js', 'other.js'],
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
    } as any;

    const throws = () => new RoutineConfig.RoutineConfig(params);

    expect(throws).to.throw('id must be a string');
  });

  it('throw if frequency is not integer', () => {
    const params = {
      id: 'something',
      frequency: {
        unit: 'hr',
        value: 1.23,
      },
    } as any;

    const throws = () => new RoutineConfig.RoutineConfig(params);

    expect(throws).to.throw('frequency.value must be an integer number');
  });

  it('throw if frequency is less than 1', () => {
    const params = {
      id: 'something',
      frequency: {
        unit: 'hr',
        value: 0,
      },
    } as any;

    const throws = () => new RoutineConfig.RoutineConfig(params);

    expect(throws).to.throw('frequency.value must not be less than 1');
  });
});
