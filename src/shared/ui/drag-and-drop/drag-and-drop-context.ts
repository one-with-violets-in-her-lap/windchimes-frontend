import { InjectionKey, Ref } from 'vue'

export const ITEM_BASE_ID = 'dragAndDropItem'

export interface DragAndDropContext {
    draggedItemId: Ref<string | null>

    draggedOverItemId: Ref<string | null>

    handleDrag: (itemId: string) => void
}

export const dragAndDropContextProvideKey =
    Symbol() as InjectionKey<DragAndDropContext>
