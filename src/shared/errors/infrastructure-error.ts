import { toError } from "@root/helpers/to-error";
import type { AnyHow } from "./encode";

const infrastructureErrorTag: unique symbol = Symbol("InfrastructureErrorTag");

export type InfrastructureError = {
  _tag: typeof infrastructureErrorTag;
  reason: Error;
};

export const infrastructureError = (e: unknown): InfrastructureError => ({
  _tag: infrastructureErrorTag,
  reason: toError(e)
});

export const isInfrastructureError = (
  error: AnyHow
): error is InfrastructureError => error._tag === infrastructureErrorTag;

export class InfrastructureErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}
