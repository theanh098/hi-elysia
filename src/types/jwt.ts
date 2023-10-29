export type JWT = {
  readonly sign: (payload: Record<string, string>) => Promise<string>;
};
