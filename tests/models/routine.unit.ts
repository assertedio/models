import { expect } from 'chai';

import { Routine } from '../../src/models';

describe('routine config unit tests', () => {
  it('minimal create', () => {
    const params = {
      id: 'something',
    };

    const routineConfig = new Routine(params);

    const expected = {
      id: 'something',
      name: '',
      description: '',
      interval: {
        unit: 'min',
        value: 5,
      },
      prepushLocal: true,
      prepushOnce: true,
      mocha: {
        files: [],
        ignore: [],
        bail: false,
        ui: 'bbd',
      },
    };

    expect(routineConfig).to.eql(expected);
  });

  it('minimal create with false', () => {
    const params = {
      id: 'something',
      prepushLocal: false,
      prepushOnce: false,
    };

    const routineConfig = new Routine(params);

    const expected = {
      id: 'something',
      name: '',
      description: '',
      interval: {
        unit: 'min',
        value: 5,
      },
      prepushLocal: false,
      prepushOnce: false,
      mocha: {
        files: [],
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
      interval: {
        unit: 'hr',
        value: 10,
      },
      prepushLocal: true,
      prepushOnce: true,
      mocha: {
        files: ['**/specific.astd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports',
      },
    } as any;

    const routineConfig = new Routine(params);

    const expected = {
      id: 'something',
      name: '',
      description: '',
      interval: {
        unit: 'hr',
        value: 10,
      },
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

    const throws = () => new Routine(params);

    expect(throws).to.throw('id must be a string');
  });

  it('throw if interval is not integer', () => {
    const params = {
      id: 'something',
      interval: {
        unit: 'hr',
        value: 1.23,
      },
    } as any;

    const throws = () => new Routine(params);

    expect(throws).to.throw('interval.value must be an integer number');
  });

  it('throw if interval is less than 1', () => {
    const params = {
      id: 'something',
      interval: {
        unit: 'hr',
        value: 0,
      },
    } as any;

    const throws = () => new Routine(params);

    expect(throws).to.throw('interval.value must not be less than 1');
  });
});
