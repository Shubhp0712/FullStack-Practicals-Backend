import moment from 'moment'
import { useState } from 'react'
import { FaCircle, FaPlus, FaSearch, FaTimes } from 'react-icons/fa'

export default function ChatSidebar({ chatList, selectedChat, onSelectChat, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).fromNow()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FaPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No chats found' : 'No online users to chat with'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedChat?.id === chat.id 
                    ? 'bg-blue-50 dark:bg-blue-900 border-r-2 border-blue-500' 
                    : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar with online indicator */}
                  <div className="relative">
                    <img
                      src={chat.photoURL || '/default-avatar.png'}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0">
                        <FaCircle className="w-3 h-3 text-green-500 bg-white dark:bg-gray-800 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Chat info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(chat.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {filteredChats.length} active conversation{filteredChats.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
