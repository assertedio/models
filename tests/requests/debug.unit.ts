import { expect } from 'chai';
import { Debug } from '../../src/requests';
import { DEPENDENCIES_VERSIONS } from '../../src/models';

describe('debug routine', () => {
  it('non-custom deps', async () => {
    const debug = new Debug({
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        ui: 'require' as any,
        bail: true,
      },
      dependencies: DEPENDENCIES_VERSIONS.V1,
      package: 'pack',
    });

    expect(debug).to.eql({
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        ui: 'require' as any,
        bail: true,
        parallel: false,
      },
      dependencies: DEPENDENCIES_VERSIONS.V1,
      package: 'pack',
    });
  });

  it('fails with explicit custom', async () => {
    expect(
      () =>
        new Debug({
          mocha: {
            files: ['bar.js'],
            ignore: ['foo.js'],
            ui: 'require' as any,
            bail: true,
            parallel: false,
          },
          package: 'pack',
          dependencies: DEPENDENCIES_VERSIONS.CUSTOM,
        })
    ).to.throw('custom dependencies are specified as object');
  });

  it('custom details', async () => {
    const updateRoutine = new Debug({
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        ui: 'require' as any,
        bail: true,
      },
      package: 'pack',
      dependencies: {
        packageJson: { dependencies: { foo: '1.3.4' } },
        shrinkwrapJson: { dependencies: { foo: '1.3.4' } },
      },
    });

    expect(updateRoutine).to.eql({
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        ui: 'require' as any,
        bail: true,
        parallel: false,
      },
      package: 'pack',
      dependencies: {
        packageJson: { dependencies: { foo: '1.3.4' } },
        shrinkwrapJson: { dependencies: { foo: '1.3.4' } },
      },
    });
  });
});
