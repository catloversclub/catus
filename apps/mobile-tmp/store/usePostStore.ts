// store/usePostStore.ts
import { create } from "zustand";

interface EditState {
  uri: string;
  texts: { id: string; content: string; x: number; y: number }[];
  mosaics: { id: string; x: number; y: number; radius: number }[];
}

interface PostStore {
  editingImages: EditState[];
  setImages: (uris: string[]) => void;
  updateImage: (index: number, newState: Partial<EditState>) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  editingImages: [],
  setImages: (uris) =>
    set({
      editingImages: uris.map((uri) => ({ uri, texts: [], mosaics: [] })),
    }),
  updateImage: (index, newState) =>
    set((state) => {
      const newImages = [...state.editingImages];
      newImages[index] = { ...newImages[index], ...newState };
      return { editingImages: newImages };
    }),
}));
