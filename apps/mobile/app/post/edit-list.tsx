// ... 기존 import에 추가
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";

import { View, Text, Switch } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePager from "./components/ImagePager";
import CustomTextInput from "./components/CustomTextInput";
import CustomTitle from "./components/CustomTitle";
import CustomDescription from "./components/CustomDescription";
import CustomSwitch from "./components/CustomSwitch";
import Avatar from "./components/Avatar";

export default function EditListScreen() {
  // ... 기존 images 파싱 로직
  const { imageUris } = useLocalSearchParams<{
    imageUris: string;
  }>();

  // JSON 문자열로 전달된 imageUris를 파싱

  const images = useMemo(() => {
    if (!imageUris) return [];

    try {
      return JSON.parse(imageUris) as string[];
    } catch {
      return [];
    }
  }, [imageUris]);

  const handleEditImage = (uri: string, index: number) => {
    router.push({
      pathname: "/post/editor",
      params: { uri, index }, // 어떤 이미지를 수정할지 전달
    });
  };

  return (
    <KeyboardAwareScrollView>
      <View className="bg-white gap-[30px] flex-col px-3 pb-[206px]">
        <ImagePager
          images={images}
          height={252}
          onImagePress={handleEditImage}
          showEditHint
        />
        <View className="flex-col gap-3">
          <Avatar type="cat" size="medium" />
          <CustomTitle>게시글 내용</CustomTitle>
          <CustomTextInput
            placeholder="Enter your text here"
            showCounter
            maxLength={300}
          />
        </View>
        <View className="flex-col gap-3">
          <CustomTitle>고양이 정보</CustomTitle>
          <CustomTextInput
            placeholder="Enter your text here"
            showCounter
            maxLength={300}
          />
        </View>
        <View className="flex-col gap-[18px]">
          <View className="flex-row items-center justify-between">
            <View className="flex-col gap-[2px]">
              <CustomTitle>댓글 허용</CustomTitle>
              <CustomDescription>
                다른 사용자가 이 게시글에 댓글을 달 수 있어요.
              </CustomDescription>
            </View>
            <CustomSwitch />
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-col gap-[2px]">
              <CustomTitle>공유 허용</CustomTitle>
              <CustomDescription>
                다른 사용자가 이 게시글을 공유할 수 있어요.
              </CustomDescription>
            </View>
            <CustomSwitch />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
