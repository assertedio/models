import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

import { enumError, ValidatedBase } from 'validated-base';
import { PROJECT_ROLE } from '../models/projectMembership';
import { toDate } from '../utils';

export interface ProjectMemberInterface {
  userId: string;
  email: string | null;
  role: PROJECT_ROLE;
  joinedAt: Date;
}

export interface ProjectMemberConstructorInterface extends Omit<ProjectMemberInterface, 'joinedAt' | 'email'> {
  joinedAt: string | Date;
  email?: string | null;
}

/**
 * @class
 */
export class ProjectMember extends ValidatedBase implements ProjectMemberInterface {
  /**
   * @param {ProjectMemberConstructorInterface} params
   * @param {boolean} validate
   */
  constructor(params: ProjectMemberConstructorInterface, validate = true) {
    super();

    this.email = params.email || null;
    this.role = params.role;
    this.userId = params.userId;
    this.joinedAt = toDate(params.joinedAt);

    if (validate) {
      this.validate();
    }
  }

  @IsOptional()
  @IsEmail()
  email: string | null;

  @IsEnum(PROJECT_ROLE, { message: enumError(PROJECT_ROLE) })
  role: PROJECT_ROLE;

  @IsString()
  userId: string;

  @IsDate()
  joinedAt: Date;
}
