import { useRouter } from 'next/router'
import {
    FaBell,
    FaBookmark,
    FaCog,
    FaCompass,
    FaEnvelope,
    FaHome,
    FaSignOutAlt,
    FaTimes,
    FaTwitter,
    FaUser
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { onlineUsers } = useSocket()

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: FaHome },
    { name: 'Explore', href: '/explore', icon: FaCompass },
    { name: 'Notifications', href: '/notifications', icon: FaBell },
    { name: 'Messages', href: '/chat', icon: FaEnvelope },
    { name: 'Bookmarks', href: '/bookmarks', icon: FaBookmark },
    { name: 'Profile', href: '/profile', icon: FaUser },
    { name: 'Settings', href: '/settings', icon: FaCog },
  ]

  const handleNavigation = (href) => {
    router.push(href)
    onClose()
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaTwitter className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                SocialMedia
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt={user?.displayName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.name === 'Messages' && onlineUsers.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {onlineUsers.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Online Users Section */}
          {onlineUsers.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Online Now ({onlineUsers.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {onlineUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <div className="relative">
                      <img
                        src={user.photoURL || '/default-avatar.png'}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
              {onlineUsers.length > 5 && (
                <button
                  onClick={() => handleNavigation('/chat')}
                  className="text-sm text-blue-500 hover:text-blue-600 mt-2"
                >
                  View all {onlineUsers.length} users
                </button>
              )}
            </div>
          )}

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
