import { useState } from 'react'
import { FaEye, FaEyeSlash, FaGoogle, FaTwitter } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await login()
    } catch (error) {
      console.error('Login failed:', error)
      // Show specific error message
      if (error.code === 'auth/popup-blocked') {
        alert('Popup was blocked. Please allow popups for this site and try again.')
      } else if (error.code === 'auth/popup-closed-by-user') {
        alert('Sign-in was cancelled. Please try again.')
      } else {
        alert('Sign-in failed. Please check your internet connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // Demo mode for testing
    console.log('Demo login clicked')
    alert('Demo mode: This would simulate a login. Please use Google Sign-in for full functionality.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaTwitter className="text-white text-2xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Welcome back!' : 'Join SocialMedia'}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Toggle between Login/Signup */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Fields */}
          <form className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-blue-500" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <button type="button" className="text-sm text-blue-500 hover:text-blue-600">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <FaGoogle className="text-red-500 mr-3" />
                Continue with Google
              </>
            )}
          </button>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            🎭 Demo Mode (Testing)
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{' '}
            <button className="text-blue-500 hover:text-blue-600">Terms of Service</button>
            {' '}and{' '}
            <button className="text-blue-500 hover:text-blue-600">Privacy Policy</button>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
