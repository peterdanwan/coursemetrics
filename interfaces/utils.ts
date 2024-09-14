// interfaces/utils.ts

export interface ISuccessResponse<T = any> {
  status: "ok";
  data: T;
}

export interface IErrorResponse {
  status: "error";
  error: {
    code: number;
    message: string;
  };
}
