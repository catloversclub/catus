import * as v from "valibot"

export const NICKNAME_MAX_LEN = 16
const NICKNAME_REGEX = /^[0-9A-Za-z가-힣]+$/

export const nicknameSchema = v.object({
    nickname: v.pipe(
      v.string(),
      v.minLength(1, "닉네임을 입력해주세요"),
      v.maxLength(NICKNAME_MAX_LEN, `최대 ${NICKNAME_MAX_LEN}자까지 입력 가능합니다`),
      v.regex(NICKNAME_REGEX, "한글/영문/숫자만 입력 가능합니다"),
    ),
  })