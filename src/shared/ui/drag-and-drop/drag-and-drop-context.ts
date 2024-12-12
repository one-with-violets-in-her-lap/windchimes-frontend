import { InjectionKey, Ref } from 'vue'

export const ITEM_BASE_ID = 'dragAndDropItem'

/**
 * state of the drag and drop list
 * 
 * shared to child `<DragAndDropItem>` components to handle dragging events
 */
export interface DragAndDropContext {
    draggedItemId: Ref<string | null>

    draggedOverItemId: Ref<string | null>

    handleDrag: (itemId: string) => void
}

/**
 * the key used for
 * [vue provide/inject](https://vuejs.org/guide/components/provide-inject.html#provide-inject)
 * calls to share **{@link DragAndDropContext|drag and drop context}**
 */
export const dragAndDropContextProvideKey =
    Symbol() as InjectionKey<DragAndDropContext>
