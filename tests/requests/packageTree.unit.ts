import { expect } from 'chai';

import { PackageTree } from '../../src/requests/packageTree';

describe('packageTree unit tests', () => {
  it('create', () => {
    const packageTree = new PackageTree({ tree: [{ path: 'something.json', hash: 'some-hash' }] });

    expect(packageTree).to.eql({ tree: [{ path: 'something.json', hash: 'some-hash' }] });
  });
});
