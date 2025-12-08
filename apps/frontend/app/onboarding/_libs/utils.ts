import type { TagOption } from "@/app/onboarding/_libs/schemas"

export function renderTagRows(items: ReadonlyArray<TagOption>, chunkSize: number): TagOption[][] {
  return items.reduce<TagOption[][]>((rows, item, index) => {
    const rowIndex = Math.floor(index / chunkSize)
    if (!rows[rowIndex]) rows[rowIndex] = []
    rows[rowIndex]!.push(item)
    return rows
  }, [])
}

