import { useQuery } from "@tanstack/react-query"
import { getUserProfile } from "./api"

// UI 컴포넌트에서 실제로 호출할 Custom Hook
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  })
}
