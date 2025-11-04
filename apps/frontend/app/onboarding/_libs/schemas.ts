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
    v.regex(NICKNAME_REGEX, "한글/영문/숫자만 입력 가능합니다"),
  ),
})

export const hasCatSchema = v.object({
  hasCat: v.boolean(),
})

export type CatGender = "female" | "male" | "unknown"

export const catProfileSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "이름을 입력해주세요"),
    v.maxLength(CAT_NAME_MAX_LEN, `최대 ${CAT_NAME_MAX_LEN}자까지 입력 가능합니다`),
    v.regex(CAT_NAME_REGEX, "한글/영문/숫자만 입력 가능합니다"),
  ),
  gender: v.picklist(["female", "male", "unknown"], "성별을 선택해주세요"),
  birthDate: v.optional(v.string()),
  breed: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
})