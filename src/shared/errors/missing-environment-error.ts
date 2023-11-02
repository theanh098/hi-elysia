import type { AnyHow } from "./encode";

const missingEnvironmentErrorTag: unique symbol = Symbol(
  "MissingEnvironmentErrorTag"
);

export type MissingEnvironmentError = {
  _tag: typeof missingEnvironmentErrorTag;
  config: string;
};

export const missingEnvironmentError = (
  config: string
): MissingEnvironmentError => ({
  _tag: missingEnvironmentErrorTag,
  config
});

export const isMissingEnvironmentError = (
  error: AnyHow
): error is MissingEnvironmentError =>
  error._tag === missingEnvironmentErrorTag;

export class MissingEnvironmentErrorAdapter extends Error {
  constructor(public message: string) {
    super(message);
  }
}
