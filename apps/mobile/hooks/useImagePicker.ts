// hooks/useImagePicker.ts
import { Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"

export const useImagePicker = () => {
  const handleCameraPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    })

    if (!result.canceled) {
      router.push({
        pathname: "../post/edit-list",
        params: {
          imageUris: JSON.stringify(result.assets.map((asset) => asset.uri)),
        },
      })
    }
  }

  return { handleCameraPress }
}
