import { HttpStatusCode } from "@angular/common/http";

export type RepositoryResult<T> = {
  status: ResponseStatus;
  result?: T
};

export type ResponseStatus = HttpStatusCode | AppStatusCode

export declare enum AppStatusCode {}

export declare type ApiResponseBody<T> = {
  success: boolean,
  message? : string,
  result?: T
}