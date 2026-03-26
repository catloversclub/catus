// store/useOnboardingStore.ts
import { create } from "zustand"

interface OnboardingState {
  nickname: string
  isCatOwner: boolean | null
  // ... step 3, 4, 5, 6 데이터들 추가
  setNickname: (nickname: string) => void
  setIsCatOwner: (isCatOwner: boolean) => void
  submitData: () => Promise<void>
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  nickname: "",
  isCatOwner: null,
  setNickname: (nickname) => set({ nickname }),
  setIsCatOwner: (isCatOwner) => set({ isCatOwner }),
  submitData: async () => {
    const data = get()
    // 여기서 모인 데이터를 API로 전송합니다.
    console.log("최종 전송 데이터:", data)
  },
}))
