import { useState } from 'react'
import PostCard from './PostCard'

export default function PostFeed() {
  const [posts] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        username: '@johndoe',
        avatar: '/default-avatar.png',
        verified: true,
      },
      content: 'Just shipped a new feature for our social media app! Really excited about the real-time chat functionality. What do you think? 🚀',
      timestamp: '2h',
      likes: 24,
      retweets: 8,
      comments: 5,
      image: null,
      liked: false,
      retweeted: false,
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        username: '@janesmith',
        avatar: '/default-avatar.png',
        verified: false,
      },
      content: 'Beautiful sunset today! Sometimes you just need to take a moment and appreciate the simple things in life. ❤️',
      timestamp: '4h',
      likes: 156,
      retweets: 23,
      comments: 12,
      image: '/sunset.jpg',
      liked: true,
      retweeted: false,
    },
    {
      id: 3,
      user: {
        name: 'Tech News',
        username: '@technews',
        avatar: '/default-avatar.png',
        verified: true,
      },
      content: 'BREAKING: Major breakthrough in AI technology announced today. This could change everything we know about machine learning and natural language processing.',
      timestamp: '6h',
      likes: 892,
      retweets: 234,
      comments: 89,
      image: null,
      liked: false,
      retweeted: true,
    },
    {
      id: 4,
      user: {
        name: 'Mike Johnson',
        username: '@mikej',
        avatar: '/default-avatar.png',
        verified: false,
      },
      content: 'Working on a new React project and loving the new features in Next.js 14! The developer experience keeps getting better. #ReactJS #NextJS',
      timestamp: '8h',
      likes: 67,
      retweets: 15,
      comments: 8,
      image: null,
      liked: false,
      retweeted: false,
    },
    {
      id: 5,
      user: {
        name: 'Sarah Wilson',
        username: '@sarahw',
        avatar: '/default-avatar.png',
        verified: false,
      },
      content: 'Coffee and code - the perfect combination for a productive morning! ☕️ What\'s your favorite coding fuel?',
      timestamp: '12h',
      likes: 43,
      retweets: 7,
      comments: 15,
      image: '/coffee-code.jpg',
      liked: true,
      retweeted: false,
    },
  ])

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {/* Loading more indicator */}
      <div className="text-center py-4">
        <button className="text-blue-500 hover:text-blue-600 font-medium">
          Load more posts
        </button>
      </div>
    </div>
  )
}
