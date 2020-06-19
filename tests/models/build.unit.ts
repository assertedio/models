import { expect } from 'chai';
import { DateTime } from 'luxon';
import { Build } from '../../src/requests/build';

describe('build unit tests', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2020-01-01T00:00:00.000Z').toJSDate();
    const params = {
      dependencies: {
        foo: '1.2.4',
      },
    };

    const shrink = {
      dependencies: {
        '@babel/code-frame': {
          version: '7.10.1',
          resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.10.1.tgz',
          // eslint-disable-next-line no-secrets/no-secrets
          integrity: 'sha512-IGhtTmpjGbYzcEDOw7DcQtbQSXcG9ftmAXtWTu9V936vDye4xjjekktFAtgZsWpzTj/X01jocB46mTywm/4SZw==',
          dev: true,
          requires: {
            '@babel/highlight': '^7.10.1',
          },
        },
      },
    };

    const build = Build.create({ packageJson: params, shrinkwrapJson: shrink }, curDate);

    expect(build).to.eql({
      id: 'pj-mWkmq',
      packageJson: {
        dependencies: {
          foo: '1.2.4',
        },
      },
      shrinkwrapJson: {
        dependencies: {
          '@babel/code-frame': {
            version: '7.10.1',
            resolved: 'https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.10.1.tgz',
            // eslint-disable-next-line no-secrets/no-secrets
            integrity: 'sha512-IGhtTmpjGbYzcEDOw7DcQtbQSXcG9ftmAXtWTu9V936vDye4xjjekktFAtgZsWpzTj/X01jocB46mTywm/4SZw==',
            dev: true,
            requires: {
              '@babel/highlight': '^7.10.1',
            },
          },
        },
      },
      createdAt: curDate,
    });
  });
});
