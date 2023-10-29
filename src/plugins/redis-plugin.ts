import Elysia from "elysia";
import { Redis } from "ioredis";

export const redisPlugin = new Elysia().state("redis", new Redis());
