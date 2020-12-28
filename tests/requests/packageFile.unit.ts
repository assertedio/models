import { expect } from 'chai';

import { PackageFile, validFilePath } from '../../src/requests/packageFile';

describe('packageFile unit tests', () => {
  it('valid file path', () => {
    expect(validFilePath('foo/bar.js')).to.eql(true);
    expect(validFilePath('foo/bar')).to.eql(true);
    expect(validFilePath('bar.js')).to.eql(true);
    expect(validFilePath('_bar.js')).to.eql(true);
    expect(validFilePath('./bar.js')).to.eql(false);
    expect(validFilePath('./bar')).to.eql(false);
    expect(validFilePath('.../bar')).to.eql(false);
    expect(validFilePath('bar/foo/')).to.eql(false);
  });

  it('create', () => {
    const packageFile = new PackageFile({ contents: 'some-contents', path: 'something/bar.js' });
    expect(packageFile).to.eql({ contents: 'some-contents', hash: 'v1-2kQuFP', path: 'something/bar.js' });
  });

  it('fails', () => {
    expect(() => new PackageFile({ contents: 'some-contents', path: './something/bar.js' })).to.throw(
      'Must be a valid path within the .asserted directory. No relative prefix.'
    );
  });
});
