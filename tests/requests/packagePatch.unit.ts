import { expect } from 'chai';

import { PackagePatch } from '../../src/requests/packagePatch';

describe('package patch unit tests', () => {
  it('create', () => {
    const packagePatch = new PackagePatch({
      files: [
        {
          contents: 'foo',
          path: 'foo/bar.js',
        },
      ],
    });

    expect(packagePatch).to.eql({
      files: [
        {
          contents: 'foo',
          hash: 'ri9',
          path: 'foo/bar.js',
        },
      ],
    });
  });

  it('create with empty files', () => {
    const packagePatch = new PackagePatch({
      files: [
        {
          contents: 'foo',
          path: 'foo/bar.js',
        },
        {
          contents: null,
          path: 'foo/bar2.js',
        },
      ],
    });

    expect(packagePatch).to.eql({
      files: [
        {
          contents: 'foo',
          hash: 'ri9',
          path: 'foo/bar.js',
        },
        {
          contents: null,
          hash: null,
          path: 'foo/bar2.js',
        },
      ],
    });
  });

  it('throw if empty array', () => {
    expect(() => new PackagePatch({ files: [] })).to.throw('files must have a length greater than 0');
  });
});
