import { expect } from 'chai';

import { PackageFile } from '../../src/requests/packageFile';

describe('packageFile unit tests', () => {
  it('create', () => {
    const packageFile = new PackageFile({ contents: 'some-contents' });

    expect(packageFile).to.eql({ contents: 'some-contents', hash: 'VufLW' });
  });
});
