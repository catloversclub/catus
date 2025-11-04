"use client"

import React, { createContext, useContext, useMemo, useReducer } from "react"

type UserType = "owner" | "rescuer" | "etc" | undefined

export type OnboardingDraft = {
  nickname?: string
  hasCat?: boolean
  userType?: UserType
  catProfile?: { name?: string; age?: number; imageUrl?: string }
  catTags?: string[]
  interests?: string[]
}

type Action =
  | { type: "set_nickname"; nickname?: string }
  | { type: "set_has_cat"; hasCat?: boolean }
  | { type: "set_user_type"; userType?: UserType }
  | { type: "set_cat_profile"; catProfile?: OnboardingDraft["catProfile"] }
  | { type: "set_cat_tags"; catTags?: string[] }
  | { type: "set_interests"; interests?: string[] }
  | { type: "reset" }

function reducer(state: OnboardingDraft, action: Action): OnboardingDraft {
  switch (action.type) {
    case "set_nickname":
      return { ...state, nickname: action.nickname }
    case "set_has_cat":
      return { ...state, hasCat: action.hasCat }
    case "set_user_type":
      return { ...state, userType: action.userType }
    case "set_cat_profile":
      return { ...state, catProfile: action.catProfile }
    case "set_cat_tags":
      return { ...state, catTags: action.catTags }
    case "set_interests":
      return { ...state, interests: action.interests }
    case "reset":
      return { nickname: undefined, hasCat: undefined, userType: undefined, catProfile: undefined, catTags: [], interests: [] }
    default:
      return state
  }
}

type OnboardingContextValue = {
  draft: OnboardingDraft
  setNickname: (nickname?: string) => void
  setHasCat: (hasCat?: boolean) => void
  setUserType: (userType?: UserType) => void
  setCatProfile: (catProfile?: OnboardingDraft["catProfile"]) => void
  setCatTags: (catTags?: string[]) => void
  setInterests: (interests?: string[]) => void
  reset: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, dispatch] = useReducer(reducer, {
    nickname: undefined,
    hasCat: true,
    userType: undefined,
    catProfile: undefined,
    catTags: [],
    interests: [],
  })

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      setNickname: (nickname) => dispatch({ type: "set_nickname", nickname }),
      setHasCat: (hasCat) => dispatch({ type: "set_has_cat", hasCat }),
      setUserType: (userType) => dispatch({ type: "set_user_type", userType }),
      setCatProfile: (catProfile) => dispatch({ type: "set_cat_profile", catProfile }),
      setCatTags: (catTags) => dispatch({ type: "set_cat_tags", catTags }),
      setInterests: (interests) => dispatch({ type: "set_interests", interests }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [draft],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}


