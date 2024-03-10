import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export type StatusCode = 400 | 404 | 406 | 500;

export type ErrorType = {
  code: StatusCode;
  message: string;
};

export type RequestError = Pick<
  PrismaClientKnownRequestError,
  'code' | 'message' | 'meta'
>;
