import { HttpStatusCode } from '@angular/common/http';
import { RepositoryResult } from '../../../shared/services/http/http.types';

export type LoginResult =
  | 'success'
  | 'wrong-credentials'
  | 'unknown'
  | 'internal-server-error';

export function loginResultMapper(
  repoResult: RepositoryResult<any>
): LoginResult {
  switch (repoResult.status) {
    case HttpStatusCode.Ok:
      return 'success';
    case HttpStatusCode.BadRequest:
      return 'wrong-credentials';
    case HttpStatusCode.InternalServerError:
      return 'internal-server-error';
    default:
      return 'unknown';
  }
}
