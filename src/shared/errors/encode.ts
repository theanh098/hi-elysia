export type AnyHow<T extends Error = Error> = {
  _tag: symbol;
  endCode: () => T;
};

export const encodeError = <T extends Error>(err: AnyHow<T>): never => {
  throw err.endCode();
};

// export const getError = (error: FiberFailure): AnyHow =>
//   pipe(
//     Effect.try({
//       catch: () => new Error("Unspecific error"),
//       try: () => error.toJSON() as { cause: { failure: AnyHow } }
//     }),
//     Effect.map(e => {
//       console.log("e.cause.failure: ", e.cause.failure);
//       return e.cause.failure;
//     }),
//     Effect.runSync
//   );
