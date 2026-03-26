import { cssInterop } from "nativewind"
import { Heart, MessageCircle, Bookmark, MoreVertical } from "lucide-react-native"

cssInterop(Heart, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      fill: true,
    },
  },
})

cssInterop(MessageCircle, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      fill: true,
    },
  },
})
cssInterop(Bookmark, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      fill: true,
    },
  },
})

export { Heart, MessageCircle, Bookmark, MoreVertical }
