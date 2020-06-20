import { expect } from 'chai';
import { UpdateRoutine } from '../../src/requests';
import { DEPENDENCIES_VERSIONS, INTERVAL_UNITS } from '../../src/models';

describe('update routine', () => {
  it('non-custom deps', async () => {
    const updateRoutine = UpdateRoutine.create(
      {
        projectId: 'proj-id',
        description: 'bar',
        name: 'foo',
        mocha: {
          files: ['bar.js'],
          ignore: ['foo.js'],
          ui: 'require' as any,
          bail: true,
        },
        interval: {
          unit: INTERVAL_UNITS.DAY,
          value: 10,
        },
        timeoutSec: 10,
      },
      'pack',
      DEPENDENCIES_VERSIONS.V1
    );

    expect(updateRoutine).to.eql({
      name: 'foo',
      description: 'bar',
      interval: {
        unit: 'day',
        value: 10,
      },
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        bail: true,
        ui: 'require',
      },
      package: 'pack',
      timeoutSec: 10,
      dependencies: 'v1',
    });
  });

  it('fails with explicit custom', async () => {
    expect(() =>
      UpdateRoutine.create(
        {
          projectId: 'proj-id',
          description: 'bar',
          name: 'foo',
          mocha: {
            files: ['bar.js'],
            ignore: ['foo.js'],
            ui: 'require' as any,
            bail: true,
          },
          interval: {
            unit: INTERVAL_UNITS.DAY,
            value: 10,
          },
          timeoutSec: 10,
        },
        'pack',
        DEPENDENCIES_VERSIONS.CUSTOM
      )
    ).to.throw('custom dependencies are specified as object');
  });

  it('custom details', async () => {
    const updateRoutine = UpdateRoutine.create(
      {
        projectId: 'proj-id',
        description: 'bar',
        name: 'foo',
        mocha: {
          files: ['bar.js'],
          ignore: ['foo.js'],
          ui: 'require' as any,
          bail: true,
        },
        interval: {
          unit: INTERVAL_UNITS.DAY,
          value: 10,
        },
        timeoutSec: 10,
      },
      'pack',
      {
        packageJson: { dependencies: { foo: '1.3.4' } },
        shrinkwrapJson: { dependencies: { foo: '1.3.4' } },
      }
    );

    expect(updateRoutine).to.eql({
      name: 'foo',
      description: 'bar',
      interval: {
        unit: 'day',
        value: 10,
      },
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        bail: true,
        ui: 'require',
      },
      package: 'pack',
      timeoutSec: 10,
      dependencies: {
        packageJson: { dependencies: { foo: '1.3.4' } },
        shrinkwrapJson: { dependencies: { foo: '1.3.4' } },
      },
    });
  });
});
