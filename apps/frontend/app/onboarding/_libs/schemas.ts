import * as v from "valibot"

export const NICKNAME_MAX_LEN = 16
const NICKNAME_REGEX = /^[0-9A-Za-z가-힣]+$/

export const CAT_NAME_MAX_LEN = 12
const CAT_NAME_REGEX = /^[0-9A-Za-z가-힣]+$/

export const nicknameSchema = v.object({
  nickname: v.pipe(
    v.string(),
    v.minLength(1, "닉네임을 입력해주세요"),
    v.maxLength(NICKNAME_MAX_LEN, `최대 ${NICKNAME_MAX_LEN}자까지 입력 가능합니다`),
    v.regex(NICKNAME_REGEX, "한글/영문/숫자만 입력 가능합니다")
  ),
})

export const hasCatSchema = v.object({
  hasCat: v.boolean(),
})

export type CatGender = "female" | "male" | "unknown"

export const catGenderOptions = [
  { value: "female" as CatGender, label: "여자" },
  { value: "male" as CatGender, label: "남자" },
  { value: "unknown" as CatGender, label: "선택 안 함" },
] as const

export const personalityTagOptions = [
  { id: 1, label: "애교쟁이 💕" },
  { id: 2, label: "수다쟁이 💨" },
  { id: 3, label: "순둥이 🧸" },
  { id: 4, label: "차분 🌿" },
  { id: 5, label: "소심 ☔" },
  { id: 6, label: "겁쟁이 🥺" },
  { id: 7, label: "예민 🔥" },
  { id: 8, label: "츤데레 😤" },
  { id: 9, label: "도도 ✨" },
  { id: 10, label: "장난꾸러기 😜 " },
  { id: 11, label: "먹보 🍩" },
  { id: 12, label: "똑쟁이 📖" },
] as const

export const appearanceTagOptions = [
  { id: 1, label: "단모" },
  { id: 2, label: "중장모" },
  { id: 3, label: "장모" },
  { id: 4, label: "치즈 🧀" },
  { id: 5, label: "삼색이 🌈" },
  { id: 6, label: "고등어 🐟" },
  { id: 7, label: "턱시도 👔" },
  { id: 8, label: "올블랙 🖤" },
  { id: 9, label: "올화이트 🤍" },
  { id: 10, label: "카오스 🍪" },
  { id: 11, label: "젖소 🐄" },
  { id: 12, label: "블루 💙" },
  { id: 13, label: "초콜릿 🍫" },
  { id: 14, label: "라일락 🩶" },
  { id: 15, label: "시나몬 🤎" },
] as const

export const catProfileSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "이름을 입력해주세요"),
    v.maxLength(CAT_NAME_MAX_LEN, `최대 ${CAT_NAME_MAX_LEN}자까지 입력 가능합니다`),
    v.regex(CAT_NAME_REGEX, "한글/영문/숫자만 입력 가능합니다")
  ),
  gender: v.picklist(["female", "male", "unknown"], "성별을 선택해주세요"),
  birthDate: v.optional(v.string()),
  breed: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
})
