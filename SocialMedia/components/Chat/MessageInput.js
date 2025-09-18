import { useState } from 'react'
import { FiSend, FiSmile } from 'react-icons/fi'

export default function MessageInput({ onSendMessage, placeholder = "Type a message..." }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FiSmile className="w-5 h-5" />
        </button>
      </div>
      
      <button
        type="submit"
        disabled={!message.trim()}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-colors"
      >
        <FiSend className="w-5 h-5" />
      </button>
    </form>
  )
}
