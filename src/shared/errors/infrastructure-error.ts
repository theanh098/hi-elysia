import type { AnyHow } from "./encode";

const infrastructureErrorTag: unique symbol = Symbol("InfrastructureErrorTag");

export type InfrastructureError = {
  _tag: typeof infrastructureErrorTag;
  reason: string;
};

export const infrastructureError = (reason: string): InfrastructureError => ({
  _tag: infrastructureErrorTag,
  reason
});

export const isInfrastructureError = (
  error: AnyHow
): error is InfrastructureError => error._tag === infrastructureErrorTag;

export class InfrastructureErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}
