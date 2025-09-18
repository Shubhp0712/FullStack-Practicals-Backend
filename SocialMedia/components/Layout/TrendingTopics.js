// import { FaHashtag, FaTrendingUp } from 'react-icons/fa'

export default function TrendingTopics() {
  const trends = [
    { topic: '#ReactJS', posts: '125K posts' },
    { topic: '#NextJS', posts: '89K posts' },
    { topic: '#WebDevelopment', posts: '234K posts' },
    { topic: '#JavaScript', posts: '567K posts' },
    { topic: '#TechNews', posts: '45K posts' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2 text-blue-500">📈</span>
          Trending Topics
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-blue-500 text-sm">#</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {trend.topic}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {trend.posts}
                  </p>
                </div>
              </div>
              <div className="text-xl text-gray-300 dark:text-gray-600">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium">
          Show more trends
        </button>
      </div>
    </div>
  )
}
