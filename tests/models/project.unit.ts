import { expect } from 'chai';
import { omit } from 'lodash';
import { DateTime } from 'luxon';

import { Project } from '../../src/models/project';

describe('project unit tests', () => {
  it('minimal create', () => {
    const params = {
      name: 'project-foo',
      billing: null,
    };

    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const project = Project.create(params, curDate);

    const expected = {
      name: 'project-foo',
      createdAt: curDate,
      updatedAt: curDate,
    };
    expect(omit(project, 'id')).to.eql(expected);
  });

  it('full create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      name: 'project-foo',
    };

    const project = Project.create(params, curDate);

    const expected = {
      name: 'project-foo',
      createdAt: curDate,
      updatedAt: curDate,
    };
    expect(omit(project, 'id')).to.eql(expected);
  });
});
