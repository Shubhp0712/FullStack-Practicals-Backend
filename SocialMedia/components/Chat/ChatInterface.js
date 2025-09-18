import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import ChatSidebar from './ChatSidebar'
import ChatWindow from './ChatWindow'

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { onlineUsers, messages } = useSocket()
  const { user } = useAuth()

  // Group messages by chat
  const chatList = onlineUsers.map(onlineUser => {
    const userMessages = messages.filter(msg => 
      (msg.senderId === onlineUser.id && msg.receiverId === user.uid) ||
      (msg.senderId === user.uid && msg.receiverId === onlineUser.id)
    )
    
    const lastMessage = userMessages[userMessages.length - 1]
    
    return {
      id: onlineUser.id,
      name: onlineUser.name,
      photoURL: onlineUser.photoURL,
      lastMessage: lastMessage?.message || 'Start a conversation',
      timestamp: lastMessage?.timestamp || new Date().toISOString(),
      unread: 0, // You can implement unread message counting
      online: true,
      messages: userMessages
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <ChatSidebar
          chatList={chatList}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-80">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaBars className="w-5 h-5" />
              </button>
              {selectedChat ? (
                <>
                  <img
                    src={selectedChat.photoURL || '/default-avatar.png'}
                    alt={selectedChat.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {selectedChat.name}
                    </h2>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </>
              ) : (
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Messages
                </h2>
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {selectedChat ? (
            <ChatWindow chat={selectedChat} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your Messages
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Send private messages to a friend or group. Select a chat from the sidebar to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
