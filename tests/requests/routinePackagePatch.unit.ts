import { expect } from 'chai';

import { RoutinePackagePatch } from '../../src/requests/routinePackagePatch';

describe('routine package patch unit tests', () => {
  it('create', () => {
    const packagePatch = new RoutinePackagePatch({
      routineId: 'foo',
      files: [
        {
          contents: 'foo',
          path: 'foo/bar.js',
        },
      ],
    });

    expect(packagePatch).to.eql({
      routineId: 'foo',
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
    const packagePatch = new RoutinePackagePatch({
      routineId: 'foo',
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
      routineId: 'foo',
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
    expect(() => new RoutinePackagePatch({ routineId: 'foo', files: [] })).to.throw('files must have a length greater than 0');
  });
});
