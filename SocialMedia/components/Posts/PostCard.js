import { useState } from 'react'
import {
    FaCheckCircle,
    FaEllipsisH,
    FaHeart,
    FaRegComment,
    FaRegHeart,
    FaRetweet,
    FaShare
} from 'react-icons/fa'

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked)
  const [retweeted, setRetweeted] = useState(post.retweeted)
  const [likes, setLikes] = useState(post.likes)
  const [retweets, setRetweets] = useState(post.retweets)

  const handleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  const handleRetweet = () => {
    setRetweeted(!retweeted)
    setRetweets(retweeted ? retweets - 1 : retweets + 1)
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Post header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {post.user.name}
                </h3>
                {post.user.verified && (
                  <FaCheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{post.user.username}</span>
                <span>•</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FaEllipsisH className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Post content */}
        <div className="mb-3">
          <p className="text-gray-900 dark:text-white leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Post image */}
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Post actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-6">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors ${
                liked
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900'
              }`}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span className="text-sm">{formatNumber(likes)}</span>
            </button>

            {/* Comment button */}
            <button className="flex items-center space-x-2 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
              <FaRegComment />
              <span className="text-sm">{formatNumber(post.comments)}</span>
            </button>

            {/* Retweet button */}
            <button
              onClick={handleRetweet}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors ${
                retweeted
                  ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900'
                  : 'text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900'
              }`}
            >
              <FaRetweet />
              <span className="text-sm">{formatNumber(retweets)}</span>
            </button>

            {/* Share button */}
            <button className="flex items-center space-x-2 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
              <FaShare />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
