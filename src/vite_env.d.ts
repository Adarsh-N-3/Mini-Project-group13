/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

declare module "matrix-crdt" {
  export class MatrixProvider {
    constructor(
      doc: any,
      matrixClient: any,
      options: { type: string; alias?: string; id?: string },
    );
    initialize(): void;
    destroy(): void;
  }
}
