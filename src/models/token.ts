import { IsDate, IsOptional, IsString } from 'class-validator';
import crypto from 'crypto';
import { DateTime } from 'luxon';
import { customAlphabet } from 'nanoid';
import { DeepPartial } from 'ts-essentials';

import { toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

interface CreateTokenInterface {
  userId: string;
}

export interface TokenInterface extends CreateTokenInterface {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date | null;
}

const CONSTANTS = {
  ID_PREFIX: 'tk-',
  HASH_ENCODING: 'hex',
  HASH_TYPE: 'sha256',
  // eslint-disable-next-line no-secrets/no-secrets
  ALPHABET: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
};

// eslint-disable-next-line no-magic-numbers
const nanoid = customAlphabet(CONSTANTS.ALPHABET, 21);

/**
 * @class
 */
export class Token extends ValidatedBase implements TokenInterface {
  /**
   * @param {TokenInterface} params
   * @param {boolean} [validate=true]
   */
  constructor(params: TokenInterface, validate = true) {
    super();

    this.id = params.id;
    this.name = params.name;
    this.userId = params.userId;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);
    this.lastUsedAt = params.lastUsedAt ? toDate(params.lastUsedAt) : params.lastUsedAt;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  lastUsedAt: Date | null;

  /**
   * Create ID from apiKey
   *
   * @param {string} apiKey
   * @returns {string}
   */
  static generateId(apiKey: string): string {
    const hash = crypto.createHash(CONSTANTS.HASH_TYPE);
    return `${CONSTANTS.ID_PREFIX}${hash.update(apiKey).digest(CONSTANTS.HASH_ENCODING as any)}`;
  }

  /**
   * Create instance of class
   *
   * @param {CreateTokenInterface} params
   * @param {Date} [curDate=now()]
   * @returns {{ apiKey: string, token: Token }}
   */
  static create(params: CreateTokenInterface, curDate = DateTime.utc().toJSDate()): { apiKey: string; token: Token } {
    const apiKey = nanoid();

    // eslint-disable-next-line no-magic-numbers
    const name = `${apiKey.slice(0, 4)}....${apiKey.slice(-4)}`;

    const tokenParams = {
      userId: params.userId,
      name,
      id: Token.generateId(apiKey),
      createdAt: curDate,
      updatedAt: curDate,
      lastUsedAt: null,
    };

    return { apiKey, token: new Token(tokenParams) };
  }

  /**
   * Get data to be pushed to the db
   *
   * @param {DeepPartial<Project>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<Token>): object {
    return instance;
  }

  /**
   * Stringify object
   *
   * @param {Project} instance
   * @returns {string}
   */
  static stringifyForCache(instance: Token): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   *
   * @param {object} object
   * @returns {Project}
   */
  static fromJson(object): Token {
    const { createdAt, updatedAt, lastActiveAt, ...rest } = object;
    return new Token({
      ...rest,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
      updatedAt: DateTime.fromISO(updatedAt).toJSDate(),
      lastUsedAt: lastActiveAt ? DateTime.fromISO(lastActiveAt).toJSDate() : null,
    });
  }

  /**
   * Parse from cache
   *
   * @param {string} stringified
   * @returns {Project}
   */
  static parseFromCache(stringified: string): Token {
    return Token.fromJson(JSON.parse(stringified));
  }
}
