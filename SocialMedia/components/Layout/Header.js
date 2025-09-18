import { useState } from 'react'
import { FaBars, FaBell, FaEnvelope, FaMoon, FaSearch, FaSun } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'

export default function Header({ onMenuClick }) {
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaBars className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="hidden sm:block ml-4 lg:ml-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search SocialMedia"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <FaBell className="w-5 h-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
            </button>

            {/* Messages */}
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <FaEnvelope className="w-5 h-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-400 ring-2 ring-white dark:ring-gray-800"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.photoURL || '/default-avatar.png'}
                  alt={user?.displayName}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search SocialMedia"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </header>
  )
}
