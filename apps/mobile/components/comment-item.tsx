import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Comment } from "@catus/constants";

interface CommentItemProps {
  item: Comment;
  onReply?: (id: string, author: string) => void;
  isReply?: boolean;
}

const CommentItem = ({ item, onReply, isReply = false }: CommentItemProps) => {
  return (
    <View className={`flex-row py-2.5  ${isReply ? "ml-11 mt-[-4px]" : ""}`}>
      {/* 아바타 */}
      <Image
        source={{ uri: item?.authorImage }}
        placeholder={require("@/assets/images/default-avatar.png")}
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
        }}
        className="bg-gray-200"
        contentFit="cover"
        cachePolicy="memory-disk" // 캐시 정책 추가
      />

      <View className="flex-1 ml-3">
        {/* 헤더 */}
        <View className="flex-row items-center mb-0.5">
          <Text className="text-[13px] font-bold text-gray-800 mr-2">
            {item?.author}
          </Text>
          <Text className="text-[12px] text-gray-400">{item?.timeAgo}</Text>
        </View>

        {/* 내용 */}
        <Text className="text-[14px] leading-5 text-gray-900">
          {item?.content}
        </Text>

        {/* 푸터 */}
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => onReply?.(item?.id, item?.author)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-[12px] font-semibold text-gray-500">
              답글 달기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="ml-4">
            <Image
              source={
                item?.liked
                  ? require("@/assets/icons/heart-filled.svg")
                  : require("@/assets/icons/heart-outline.svg")
              }
              className="w-3.5 h-3.5"
              tintColor={item?.liked ? "#FF3B30" : "#999"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(CommentItem);
