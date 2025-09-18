import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { FaImage, FaPaperclip, FaPaperPlane, FaSmile } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'

export default function ChatWindow({ chat }) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()
  const { sendMessage, messages, typingUsers, startTyping, stopTyping, joinChat, leaveChat } = useSocket()

  const chatId = `${user.uid}_${chat.id}`
  const chatMessages = messages.filter(msg => 
    (msg.senderId === chat.id && msg.receiverId === user.uid) ||
    (msg.senderId === user.uid && msg.receiverId === chat.id)
  )

  useEffect(() => {
    joinChat(chatId)
    return () => leaveChat(chatId)
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(chat.id, message.trim())
      setMessage('')
      stopTyping(chatId)
    }
  }

  const handleTyping = (value) => {
    setMessage(value)
    if (value.trim() && !isTyping) {
      setIsTyping(true)
      startTyping(chatId)
    } else if (!value.trim() && isTyping) {
      setIsTyping(false)
      stopTyping(chatId)
    }
  }

  const formatMessageTime = (timestamp) => {
    return moment(timestamp).format('HH:mm')
  }

  const isTypingUser = typingUsers.find(u => u.userId === chat.id)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8">
            <img
              src={chat.photoURL || '/default-avatar.png'}
              alt={chat.name}
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {chat.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start a conversation with {chat.name}
            </p>
          </div>
        ) : (
          <>
            {chatMessages.map((msg, index) => {
              const isOwn = msg.senderId === user.uid
              const showAvatar = index === 0 || chatMessages[index - 1].senderId !== msg.senderId
              
              return (
                <div
                  key={index}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!isOwn && showAvatar && (
                      <img
                        src={chat.photoURL || '/default-avatar.png'}
                        alt={chat.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    {!isOwn && !showAvatar && (
                      <div className="w-6" />
                    )}
                    
                    <div className={`px-4 py-2 rounded-2xl break-words ${
                      isOwn
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatMessageTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {/* Typing indicator */}
            {isTypingUser && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                  <img
                    src={chat.photoURL || '/default-avatar.png'}
                    alt={chat.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          {/* Attachment buttons */}
          <div className="flex space-x-1">
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaImage className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaPaperclip className="w-4 h-4" />
            </button>
          </div>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder={`Message ${chat.name}...`}
              rows="1"
              className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 max-h-32"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaSmile className="w-4 h-4" />
            </button>
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
