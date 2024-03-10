import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ErrorType, RequestError } from './types';

//! More info on: https://www.prisma.io/docs/reference/api-reference/error-reference#common

export default (error: RequestError, context: string) => {
  const logger = new Logger(context);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorCodes: Record<string, ErrorType> = {
      P2000: {
        code: 400,
        message: `The value ${error.meta?.column_name} is too long, please try again with a shorter value`,
      },
      P2002: {
        code: 400,
        message: `The value of "${error.meta?.target}" already exists in the database`,
      },
      P2011: {
        code: 406,
        message: `The value ${error.meta} cannot be null, please try again with a different value`,
      },
      P2012: {
        code: 406,
        message: `The value ${error.meta} is required, please try again with a different value`,
      },
      P2025: {
        code: 404,
        message: `The value does not found`,
      },
      Default: {
        code: 500,
        message: `An error has occurred, please try again later`,
      },
    };

    const { message, code } = errorCodes[error.code] || errorCodes.Default;

    logger.error(message, error.message);

    if (code === 400) throw new BadRequestException(message);
    if (code === 404) throw new NotFoundException(message);
    if (code === 406) throw new NotAcceptableException(message);
    if (code === 500) throw new InternalServerErrorException(message);
  } else {
    logger.error(error.message);

    throw new InternalServerErrorException(error.message);
  }
};
