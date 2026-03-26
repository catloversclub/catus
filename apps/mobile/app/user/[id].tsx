import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Suspense, useCallback, useState } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  Pressable,
  FlatList,
  useWindowDimensions,
} from "react-native"
import { Image } from "expo-image"

// 💡 훅 임포트 경로는 프로젝트에 맞게 수정해 주세요.
import {
  useUserDetailQuery, // 특정 유저 조회 훅 (useUserProfileQuery는 /me 이므로 이걸 써야 합니다)
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "@/api/domains/user/queries"
import { getMediaUrl } from "@/lib/utils"
import { useUserPostsQuery } from "@/api/domains/post/queries"

function UserDetailContent({ userId }: { userId: string }) {
  const router = useRouter()

  // 💡 3열 그리드를 위해 화면 가로폭을 3으로 나눕니다.
  const { width } = useWindowDimensions()
  const GRID_ITEM_SIZE = width / 3

  console.log(userId)

  // 1. 프로필과 게시물 데이터 병렬 패칭 (Suspense 덕분에 둘 다 로딩 완료되어야 렌더링됨)
  const { data: profile, refetch: refetchProfile } = useUserDetailQuery(userId)
  const { data: posts, refetch: refetchPosts } = useUserPostsQuery(userId)

  const [refreshing, setRefreshing] = useState(false)

  const { mutate: followUser } = useFollowUserMutation()
  const { mutate: unfollowUser } = useUnfollowUserMutation()

  // 2. 당겨서 새로고침 시 프로필과 게시물을 동시에 리패칭
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([refetchProfile(), refetchPosts()])
    setRefreshing(false)
  }, [refetchProfile, refetchPosts])

  // 💡 [확인 필요] 서버에서 내려주는 '팔로우 여부' 필드명으로 수정하세요.
  const isFollowing = profile.isFollowing || false

  // 3. 팔로우 버튼 토글 핸들러
  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(userId)
    } else {
      followUser(userId)
    }
  }

  const nickname = profile.nickname || "알 수 없는 사용자"
  const profileImage = profile.profileImageUrl || require("@/assets/images/default-avatar.png")

  // 4. 프로필 영역 UI (FlatList의 Header로 들어갑니다)
  const renderHeader = () => (
    <View className="flex-col items-center border-b border-semantic-border-primary px-4 py-8">
      <Image
        source={typeof profileImage === "string" ? { uri: profileImage } : profileImage}
        style={{ width: 80, height: 80, borderRadius: 40 }}
        contentFit="cover"
      />
      <Text className="typo-h3 mt-4 text-semantic-text-primary">{nickname}</Text>

      <View className="mt-4 flex-row items-center gap-8">
        <View className="flex-col items-center">
          <Text className="typo-body1 text-semantic-text-primary">{profile.followerCount}</Text>
          <Text className="typo-label2 text-semantic-text-secondary">팔로워</Text>
        </View>
        <View className="flex-col items-center">
          <Text className="typo-body1 text-semantic-text-primary">{profile.followingCount}</Text>
          <Text className="typo-label2 text-semantic-text-secondary">팔로잉</Text>
        </View>
      </View>

      {/* 팔로우 버튼 (상태에 따라 색상과 텍스트 변경) */}
      <Pressable
        onPress={handleFollowToggle}
        className={`mt-6 w-full items-center justify-center rounded-md py-3 active:opacity-60 ${
          isFollowing ? "bg-semantic-bg-secondary" : "bg-semantic-icon-accent"
        }`}
      >
        <Text className={`typo-sub1 ${isFollowing ? "text-semantic-text-primary" : "text-white"}`}>
          {isFollowing ? "팔로잉" : "팔로우"}
        </Text>
      </Pressable>
    </View>
  )

  return (
    <>
      {/* ✨ 요청하신 동적 타이틀 변경 */}
      <Stack.Screen options={{ title: `${nickname}님의 프로필` }} />

      {/* ✨ ScrollView 대신 FlatList로 3열 그리드 완벽 구현 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3} // 3열 설정
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={renderHeader} // 프로필을 헤더에 부착
        renderItem={({ item }) => {
          // 게시물의 첫 번째 이미지 추출
          const firstImage = item.images?.[0]?.url

          return (
            <Pressable
              onPress={() => router.push(`/post/${item.id}`)}
              style={{
                width: GRID_ITEM_SIZE,
                height: GRID_ITEM_SIZE,
                padding: 1, // 이미지 사이의 틈(Gap) 역할
              }}
            >
              {firstImage ? (
                <Image
                  source={getMediaUrl(firstImage)}
                  style={{ flex: 1, backgroundColor: "#f0f0f0" }}
                  contentFit="cover"
                />
              ) : (
                // 이미지가 아예 없는 예외 포스트 방어 코드
                <View style={{ flex: 1, backgroundColor: "#f0f0f0" }} />
              )}
            </Pressable>
          )
        }}
        // 게시물이 없을 때 보여줄 UI
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="typo-body2 text-semantic-text-secondary">
              등록된 게시물이 없습니다.
            </Text>
          </View>
        }
      />
    </>
  )
}

// 💡 최상위 래퍼 (Suspense)
export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        }
      >
        <UserDetailContent userId={id} />
      </Suspense>
    </View>
  )
}
