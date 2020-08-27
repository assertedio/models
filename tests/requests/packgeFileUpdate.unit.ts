import { expect } from 'chai';

import { PackageFileUpdate } from '../../src/requests/packageFileUpdate';

describe('packageFileUpdate unit tests', () => {
  it('create', () => {
    expect(
      new PackageFileUpdate({
        contents: 'some-contents',
        path: 'something/bar.js',
      })
    ).to.eql({ contents: 'some-contents', hash: 'v1-2kQuFP', path: 'something/bar.js' });
    expect(new PackageFileUpdate({ contents: null, path: 'something/bar.js' })).to.eql({
      contents: null,
      hash: null,
      path: 'something/bar.js',
    });
  });

  it('create empty file', () => {
    expect(
      new PackageFileUpdate({
        contents: '',
        path: 'something/bar.js',
      })
    ).to.eql({ contents: '', hash: 'v1-Z22lby3', path: 'something/bar.js' });
  });

  it('fails', () => {
    expect(() => new PackageFileUpdate({ contents: 'some-contents', path: './something/bar.js' })).to.throw(
      'Must be a valid path within the .asserted directory. No relative prefix.'
    );
  });
});
