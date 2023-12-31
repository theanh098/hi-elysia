import { Elysia } from "elysia";

import { AuthErrorAdapter } from "@root/shared/errors/auth-error";
import { DatabaseQueryErrorAdapter } from "@root/shared/errors/database-query-error";
import { DatabaseQueryNotFoundErrorAdapter } from "@root/shared/errors/database-query-not-found-error";
import { InfrastructureErrorAdapter } from "@root/shared/errors/infrastructure-error";

export const errorPlugin = new Elysia()
  .error({
    AuthError: AuthErrorAdapter,
    InfrastructureError: InfrastructureErrorAdapter,
    DatabaseQueryNotFoundError: DatabaseQueryNotFoundErrorAdapter,
    DatabaseNotFoundError: DatabaseQueryErrorAdapter
  })
  .onError(({ code, set, error }) => {
    switch (code) {
      case "InfrastructureError":
      case "DatabaseQueryNotFoundError":
      case "DatabaseNotFoundError":
        set.status = 500;
        return {
          tag: code,
          message: error.message,
          code: set.status
        };
      case "AuthError":
        set.status = 401;
      default:
        break;
    }

    return {
      tag: code,
      message: error.message,
      code: set.status
    };
  });
