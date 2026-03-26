import React from "react"
import { Image } from "expo-image"
import { Link } from "expo-router"
import { Pressable } from "react-native"
import { PROFILE_SIZE } from "@/constants/user"
import { Author } from "@/api/domains/post/types"

const Profile = ({ user }: { user: Author }) => {
  // 이미지가 없을 경우 띄워줄 기본 아바타 설정 (경로는 프로젝트에 맞게 수정)
  const defaultAvatar = require("@/assets/images/default-avatar.png")

  const { id, profileImageUrl } = user

  // imageUrl이 있으면 해당 URL을 사용하고, 없으면 기본 이미지를 사용합니다.
  // 💡 만약 getMediaUrl() 유틸이 필요하다면 getMediaUrl(imageUrl)로 감싸주세요!
  const imageSource = profileImageUrl ? { uri: profileImageUrl } : defaultAvatar

  return (
    <Link href={`/user/${id}`} asChild>
      <Pressable className="active:opacity-60">
        <Image
          source={imageSource}
          style={{ width: PROFILE_SIZE, height: PROFILE_SIZE, borderRadius: PROFILE_SIZE }}
          contentFit="cover"
          alt={`${id} profile`}
        />
      </Pressable>
    </Link>
  )
}

export default Profile
