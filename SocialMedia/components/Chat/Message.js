import { formatDistanceToNow } from 'date-fns'

export default function Message({ message, isOwn, user }) {
  const messageTime = new Date(message.timestamp)

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Avatar for received messages */}
        {!isOwn && (
          <div className="flex items-center mb-1">
            <img
              src={user?.photoURL || '/default-avatar.png'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.name || 'Unknown User'}
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`px-4 py-2 rounded-2xl break-words ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
          }`}
        >
          <p className="text-sm">{message.content || message.message}</p>
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(messageTime, { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}
