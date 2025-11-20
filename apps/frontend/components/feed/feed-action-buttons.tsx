import { Heart, MessageCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedActionButtonsProps {
  liked: boolean
  bookmarked: boolean
  onLikeToggle: () => void
  onBookmarkToggle: () => void
  onComment: () => void
}

export function FeedActionButtons({
  liked,
  bookmarked,
  onLikeToggle,
  onBookmarkToggle,
  onComment,
}: FeedActionButtonsProps) {
  return (
    <div className="absolute right-3 bottom-3 z-10 flex gap-3">
      <Button size="icon" variant="ghost" onClick={onLikeToggle}>
        <Heart
          className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "text-icon-tertiary"}`}
        />
      </Button>
      <Button size="icon" variant="ghost" onClick={onComment}>
        <MessageCircle className="text-icon-tertiary h-6 w-6" />
      </Button>
      <Button size="icon" variant="ghost" onClick={onBookmarkToggle}>
        <Bookmark
          className={`h-6 w-6 ${bookmarked ? "fill-yellow-400 text-yellow-400" : "text-icon-tertiary"}`}
        />
      </Button>
    </div>
  )
}
