import { useState } from 'react'
import { FaImage, FaMapMarkerAlt, FaSmile, FaVideo } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'

export default function CreatePost({ onPostCreated }) {
  const [postText, setPostText] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const { user } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (postText.trim()) {
      // Handle post creation logic here
      console.log('Creating post:', postText)
      setPostText('')
      setShowOptions(false)
      if (onPostCreated) onPostCreated()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex space-x-3">
          <img
            src={user?.photoURL || '/default-avatar.png'}
            alt={user?.displayName}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's happening?"
              className="w-full resize-none border-none focus:ring-0 text-xl placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-white"
              rows="3"
              onFocus={() => setShowOptions(true)}
            />
            
            {showOptions && (
              <div className="mt-4 space-y-4">
                {/* Media options */}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <FaImage />
                    <span className="text-sm">Photo</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <FaVideo />
                    <span className="text-sm">Video</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <FaSmile />
                    <span className="text-sm">Emoji</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <FaMapMarkerAlt />
                    <span className="text-sm">Location</span>
                  </button>
                </div>

                {/* Post options */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>Everyone can reply</option>
                      <option>People you follow</option>
                      <option>Only people you mention</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    {postText.length > 0 && (
                      <span className={`text-sm ${
                        postText.length > 280 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {280 - postText.length}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={!postText.trim() || postText.length > 280}
                      className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
