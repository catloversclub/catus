import React, { useCallback, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from "react-native"
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  TouchableWithoutFeedback,
} from "@gorhom/bottom-sheet"
import ArrowUpIcon from "@/assets/icons/arrow-up.svg"
import CommentItem from "./comment-item"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Comment } from "@catus/constants"

interface CommentSheetProps {
  commentSheetRef: React.RefObject<BottomSheetModal | null>
  comments: Comment[]
}

export default function CommentSheet({ commentSheetRef, comments }: CommentSheetProps) {
  const [commentText, setCommentText] = useState("")
  const [replyingTo, setReplyingTo] = useState<{
    id: string
    author: string
  } | null>(null)
  const insets = useSafeAreaInsets()

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <View className="mb-2">
        <CommentItem item={item} onReply={(id, author) => setReplyingTo({ id, author })} />
        {item.replies?.map((reply) => (
          <CommentItem key={reply.id} item={reply} isReply />
        ))}
      </View>
    ),
    [],
  )
  return (
    <BottomSheetModal
      ref={commentSheetRef}
      // keyboardBehavior="interactive"
      keyboardBehavior="fillParent"
      // keyboardBlurBehavior="restore"
      // android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView className="relative flex-1">
        <View className="items-center border-b border-gray-100 py-4">
          <Text className="text-base font-semibold text-gray-500">댓글 {comments?.length}</Text>
        </View>

        <BottomSheetFlatList
          data={comments}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 80, // 입력창 높이만큼 리스트 끝에 여백 확보
          }}
          renderItem={renderItem}
        />
        <View
          className="absolute bottom-10 left-0 right-0 border-t border-gray-100 bg-white px-4 pt-2"
          style={{ paddingBottom: insets.bottom + 0 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                {replyingTo && (
                  <View className="mb-2 flex-row justify-between px-1">
                    <Text className="text-sm text-gray-400">
                      @{replyingTo.author}님에게 답글 남기는 중
                    </Text>
                    <TouchableOpacity onPress={() => setReplyingTo(null)}>
                      <Text className="text-sm font-semibold text-blue-500">취소</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View className="flex-row items-end rounded-2xl bg-gray-100 px-3 py-2">
                  <BottomSheetTextInput
                    className="max-h-24 flex-1 p-0 text-[15px] text-black"
                    placeholder="댓글 남기기..."
                    placeholderTextColor="#9ca3af"
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                  />
                  <TouchableOpacity className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-yellow-400">
                    <ArrowUpIcon width={20} height={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>

        {/* 하단 댓글 입력창 */}
      </BottomSheetView>
    </BottomSheetModal>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
})
