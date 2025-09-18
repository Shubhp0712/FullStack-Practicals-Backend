// import { FaCheck, FaUserPlus } from 'react-icons/fa'

export default function SuggestedUsers() {
  const suggestedUsers = [
    {
      id: 1,
      name: 'John Doe',
      username: '@johndoe',
      avatar: '/default-avatar.png',
      followers: '1.2K',
      isFollowing: false,
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: '@janesmith',
      avatar: '/default-avatar.png',
      followers: '845',
      isFollowing: false,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      username: '@mikej',
      avatar: '/default-avatar.png',
      followers: '2.1K',
      isFollowing: true,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      username: '@sarahw',
      avatar: '/default-avatar.png',
      followers: '567',
      isFollowing: false,
    },
  ]

  const handleFollow = (userId) => {
    // Handle follow/unfollow logic
    console.log('Follow user:', userId)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2 text-blue-500">👥</span>
          Suggested for you
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{user.username}</span>
                    <span>•</span>
                    <span>{user.followers} followers</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleFollow(user.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  user.isFollowing
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {user.isFollowing ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">✓</span>
                    <span>Following</span>
                  </div>
                ) : (
                  'Follow'
                )}
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium">
          Show more suggestions
        </button>
      </div>
    </div>
  )
}
