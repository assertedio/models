import { expect } from 'chai';

import { PackagePatch, validatePackagePatchFiles } from '../../src/requests/packagePatch';

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

  it('validate package.json changes', () => {
    expect(() => validatePackagePatchFiles([{ path: 'package.json', contents: null, hash: null }])).to.throw('Cannot delete package.json');
    expect(() => validatePackagePatchFiles([{ path: 'package.json', contents: '', hash: null }])).to.throw('package.json contains invalid JSON');
  });

  it('validate routine.json changes', () => {
    expect(() => validatePackagePatchFiles([{ path: 'routine.json', contents: null, hash: null }])).to.throw('Cannot delete routine.json');
    expect(() => validatePackagePatchFiles([{ path: 'routine.json', contents: '', hash: null }])).to.throw('routine.json contains invalid JSON');
    expect(() => validatePackagePatchFiles([{ path: 'routine.json', contents: '{}', hash: null }])).to.throw(
      'Error in routine.json: id must be a string, projectId must be a string'
    );
  });
});
