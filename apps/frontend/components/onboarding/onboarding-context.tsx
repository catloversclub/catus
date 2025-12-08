"use client"

import React, { createContext, useContext, useMemo, useReducer } from "react"

export type CatGender = "female" | "male" | "unknown"

export type CatData = {
  name: string
  gender?: CatGender
  birthDate?: string
  breed?: string
  imageUrl?: string // preview URL (base64)
  imageFile?: File // 실제 업로드할 파일 (온보딩 단계에서 저장)
  personalities?: number[]
  appearances?: number[]
}

export type OnboardingDraft = {
  nickname?: string
  hasCat?: boolean
  catProfile?: {
    name?: string
    gender?: CatGender
    birthDate?: string
    breed?: string
    imageUrl?: string
  }
  catTags?: string[]
  cats?: CatData[]
  interests?: string[]
}

type Action =
  | { type: "set_nickname"; nickname?: string }
  | { type: "set_has_cat"; hasCat?: boolean }
  | { type: "set_cat_profile"; catProfile?: OnboardingDraft["catProfile"] }
  | { type: "set_cat_tags"; catTags?: string[] }
  | { type: "add_cat"; cat: CatData }
  | { type: "reset_current_cat" }
  | { type: "set_interests"; interests?: string[] }
  | { type: "reset" }

function reducer(state: OnboardingDraft, action: Action): OnboardingDraft {
  switch (action.type) {
    case "set_nickname":
      return { ...state, nickname: action.nickname }
    case "set_has_cat":
      return { ...state, hasCat: action.hasCat }
    case "set_cat_profile":
      return { ...state, catProfile: action.catProfile }
    case "set_cat_tags":
      return { ...state, catTags: action.catTags }
    case "add_cat":
      return {
        ...state,
        cats: [...(state.cats || []), action.cat],
      }
    case "reset_current_cat":
      return {
        ...state,
        catProfile: undefined,
        catTags: [],
      }
    case "set_interests":
      return { ...state, interests: action.interests }
    case "reset":
      return {
        nickname: undefined,
        hasCat: undefined,
        catProfile: undefined,
        catTags: [],
        cats: [],
        interests: [],
      }
    default:
      return state
  }
}

type OnboardingContextValue = {
  draft: OnboardingDraft
  setNickname: (nickname?: string) => void
  setHasCat: (hasCat?: boolean) => void
  setCatProfile: (catProfile?: OnboardingDraft["catProfile"]) => void
  setCatTags: (catTags?: string[]) => void
  addCat: (cat: CatData) => void
  resetCurrentCat: () => void
  setInterests: (interests?: string[]) => void
  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, dispatch] = useReducer(reducer, {
    nickname: undefined,
    hasCat: true,
    catProfile: undefined,
    catTags: [],
    cats: [],
    interests: [],
  })

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      setNickname: (nickname) => dispatch({ type: "set_nickname", nickname }),
      setHasCat: (hasCat) => dispatch({ type: "set_has_cat", hasCat }),
      setCatProfile: (catProfile) => dispatch({ type: "set_cat_profile", catProfile }),
      setCatTags: (catTags) => dispatch({ type: "set_cat_tags", catTags }),
      addCat: (cat) => dispatch({ type: "add_cat", cat }),
      resetCurrentCat: () => dispatch({ type: "reset_current_cat" }),
      setInterests: (interests) => dispatch({ type: "set_interests", interests }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [draft]
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}
