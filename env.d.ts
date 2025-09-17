/// <reference types="vite/client" />
interface ImportMeta {
  readonly glob: import('vite').ImportGlobFunction;
  readonly globEager: import('vite').ImportGlobEagerFunction;
}