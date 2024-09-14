// utils/response.ts

import { type ISuccessResponse, type IErrorResponse } from '@/interfaces';

/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   "data": ...
 * }
 */

export const createSuccessResponse = function <T>(data: T): ISuccessResponse<T> {
  return {
    status: 'ok',
    data,
  };
};

/**
 * An error response looks like:
 *
 * {
 *   "status": "error",
 *   "error": {
 *     "code": 400,
 *     "message": "invalid request, missing ...",
 *   }
 * }
 */

export const createErrorResponse = function (code: number, message: string): IErrorResponse {
  return { status: 'error', error: { code: code, message: message } };
};
