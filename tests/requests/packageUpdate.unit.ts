import { expect } from 'chai';

import { PackageUpdate } from '../../src/requests/packageUpdate';

describe('package update unit tests', () => {
  it('create', () => {
    const packageUpdate = new PackageUpdate({
      files: [
        {
          contents: 'foo',
          path: 'foo/bar.js',
        },
      ],
    });

    expect(packageUpdate).to.eql({
      files: [
        {
          contents: 'foo',
          hash: 'ri9',
          path: 'foo/bar.js',
        },
      ],
    });
  });

  it('throw if empty array', () => {
    expect(() => new PackageUpdate({ files: [] })).to.throw('files must have a length greater than 0');
  });
});
