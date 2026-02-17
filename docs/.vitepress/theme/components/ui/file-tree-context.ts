import type { InjectionKey, Ref } from 'vue'

export interface FileTreeContext {
  depth: Ref<number>
}

export const fileTreeContextKey: InjectionKey<FileTreeContext> = Symbol('vp-pro-file-tree-context')
