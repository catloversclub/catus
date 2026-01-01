export interface Comment {
  id: string
  author: string
  authorImage: string
  content: string
  timeAgo: string
  liked: boolean
  isAuthor?: boolean
  replies?: Comment[]
}
