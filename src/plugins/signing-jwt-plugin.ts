import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const signingJwtPlugin = new Elysia()
  .use(
    jwt({
      secret: process.env.JWT_SECRET!,
      name: "jwtAccess",
      exp: "3d"
    })
  )
  .use(
    jwt({
      secret: process.env.JWT_REFRESH!,
      name: "jwtRefresh",
      exp: "90d"
    })
  );
