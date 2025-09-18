import { useState } from 'react'
import Header from '../Layout/Header'
import Sidebar from '../Layout/Sidebar'
import SuggestedUsers from '../Layout/SuggestedUsers'
import TrendingTopics from '../Layout/TrendingTopics'
import CreatePost from '../Posts/CreatePost'
import PostFeed from '../Posts/PostFeed'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Main dashboard area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Posts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <CreatePost 
                onPostCreated={() => setShowCreatePost(false)} 
              />

              {/* Post Feed */}
              <PostFeed />
            </div>

            {/* Right Column - Sidebar content */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <TrendingTopics />

              {/* Suggested Users */}
              <SuggestedUsers />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
