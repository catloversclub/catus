import { getServerSession } from "@/lib/auth/getServerSession"
import { PostLoginClient } from "./PostLoginClient"

export default async function PostLoginPage() {
  const session = await getServerSession()

  if (!session) {
    return <div>로그인 정보를 불러올 수 없습니다.</div>
  }

  // 서버에서 받은 session 데이터를 클라이언트 컴포넌트로 넘겨줍니다.
  return <PostLoginClient sessionData={session} />
}
