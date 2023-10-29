import { Elysia } from "elysia";

import { postController } from "./controllers/post-controller";
import { userController } from "./controllers/user-controller";
import { errorPlugin } from "./plugins/error-plugin";

const app = new Elysia()
  .use(errorPlugin)
  .use(userController)
  .use(postController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
