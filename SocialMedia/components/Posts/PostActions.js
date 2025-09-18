import { FiBookmark, FiHeart, FiMessageCircle, FiShare } from 'react-icons/fi'

export default function PostActions({ post, onLike, onComment, onShare, onBookmark }) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-6">
        {/* Like Button */}
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center space-x-2 text-sm transition-colors ${
            post.isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiHeart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes || 0}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => onComment(post.id)}
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <FiMessageCircle className="w-5 h-5" />
          <span>{post.comments || 0}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => onShare(post.id)}
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          <FiShare className="w-5 h-5" />
          <span>{post.shares || 0}</span>
        </button>
      </div>

      {/* Bookmark Button */}
      <button
        onClick={() => onBookmark(post.id)}
        className={`text-sm transition-colors ${
          post.isBookmarked 
            ? 'text-blue-500 hover:text-blue-600' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
      >
        <FiBookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
      </button>
    </div>
  )
}
