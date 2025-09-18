import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io('http://localhost:5000')
      setSocket(newSocket)

      // Join with user data
      newSocket.emit('user_join', {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      })

      // Listen for events
      newSocket.on('online_users', (users) => {
        setOnlineUsers(users.filter(u => u.id !== user.uid))
      })

      newSocket.on('user_online', (userData) => {
        if (userData.id !== user.uid) {
          setOnlineUsers(prev => {
            const exists = prev.find(u => u.id === userData.id)
            if (!exists) {
              return [...prev, userData]
            }
            return prev
          })
        }
      })

      newSocket.on('user_offline', (userData) => {
        setOnlineUsers(prev => prev.filter(u => u.id !== userData.id))
      })

      newSocket.on('receive_message', (messageData) => {
        setMessages(prev => [...prev, { ...messageData, type: 'received' }])
      })

      newSocket.on('message_sent', (messageData) => {
        setMessages(prev => [...prev, { ...messageData, type: 'sent' }])
      })

      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => {
          const exists = prev.find(u => u.userId === data.userId)
          if (!exists) {
            return [...prev, data]
          }
          return prev
        })
      })

      newSocket.on('user_stop_typing', (data) => {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId))
      })

      return () => {
        newSocket.close()
      }
    } else {
      // Clean up when user logs out
      setSocket(null)
      setOnlineUsers([])
      setMessages([])
      setTypingUsers([])
    }
  }, [user])

  const sendMessage = (receiverId, message) => {
    if (socket && user) {
      const messageData = {
        receiverId,
        message,
        senderId: user.uid,
        senderName: user.displayName,
        timestamp: new Date().toISOString()
      }
      socket.emit('private_message', messageData)
    }
  }

  const joinChat = (chatId) => {
    if (socket) {
      socket.emit('join_chat', chatId)
    }
  }

  const leaveChat = (chatId) => {
    if (socket) {
      socket.emit('leave_chat', chatId)
    }
  }

  const startTyping = (chatId) => {
    if (socket && user) {
      socket.emit('typing_start', {
        chatId,
        userId: user.uid,
        userName: user.displayName
      })
    }
  }

  const stopTyping = (chatId) => {
    if (socket && user) {
      socket.emit('typing_stop', {
        chatId,
        userId: user.uid
      })
    }
  }

  const value = {
    socket,
    onlineUsers,
    messages,
    typingUsers,
    sendMessage,
    joinChat,
    leaveChat,
    startTyping,
    stopTyping,
    setMessages
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
