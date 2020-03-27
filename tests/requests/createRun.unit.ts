import { expect } from 'chai';

import { CreateRun } from '../../src/requests';

describe('createRun unit tests', () => {
  it('minimal create', () => {
    const params = {
      package: 'compressed-content',
    };

    const createRun = new CreateRun(params);

    const expected = {
      package: 'compressed-content',
      mocha: {
        files: ['**/*.asrtd.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
      },
    };

    expect(createRun).to.eql(expected);
  });

  it('full create', () => {
    const params = {
      package: 'compressed-content',
      mocha: {
        files: ['something.js', 'something-else.js'],
        ignore: ['athing.js'],
        bail: true,
        ui: 'require',
      },
    };

    const createRun = new CreateRun(params as any);

    const expected = {
      package: 'compressed-content',
      mocha: {
        files: ['something.js', 'something-else.js'],
        ignore: ['athing.js'],
        bail: true,
        ui: 'require',
      },
    };

    expect(createRun).to.eql(expected);
  });

  it('reject with missing package', () => {
    expect(() => new CreateRun({ routineId: 'routine-id' } as any)).to.throw('package must be a string');
  });

  it('reject with bad files', () => {
    const params = {
      package: 'compressed-content',
      routineId: 'routine-id',
      mocha: {
        files: {},
      },
    };

    expect(() => new CreateRun(params as any)).to.throw('mocha.each value in files must be a string');
  });
});
