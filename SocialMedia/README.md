# SocialMedia App

A modern social media application built with Next.js, Express.js, Socket.IO, and Firebase Authentication.

## Features

### 🔐 Authentication
- Google OAuth integration with Firebase
- Secure login/logout system
- User profile management

### 💬 Real-time Chat
- One-on-one messaging
- Online/offline status indicators
- Typing indicators
- Message delivery confirmations
- Real-time notifications

### 📱 Social Features
- Create and share posts
- Like, comment, and share functionality
- Post feed with infinite scroll
- User profiles and avatars
- Trending topics
- Suggested users

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/light mode support
- Clean and intuitive interface
- Smooth animations and transitions
- Mobile-first approach

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **React Icons** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Server framework
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing

### Authentication & Database
- **Firebase Auth** - Authentication
- **Firebase Firestore** - Database
- **Firebase Storage** - File storage

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with authentication enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SocialMedia
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase Setup:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication with Google provider
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config to `lib/firebase.js`

4. **Start the development servers:**

   **Option 1: Start both servers together:**
   ```bash
   npm run dev:full
   ```

   **Option 2: Start servers separately:**
   
   Terminal 1 - Express Server:
   ```bash
   npm run server
   ```
   
   Terminal 2 - Next.js App:
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
SocialMedia/
├── components/
│   ├── Auth/
│   │   └── AuthPage.js          # Login/Signup page
│   ├── Chat/
│   │   ├── ChatInterface.js     # Main chat layout
│   │   ├── ChatSidebar.js       # Chat users list
│   │   ├── ChatWindow.js        # Chat messages area
│   │   ├── Message.js           # Individual message
│   │   └── MessageInput.js      # Message input field
│   ├── Dashboard/
│   │   └── Dashboard.js         # Main dashboard layout
│   ├── Layout/
│   │   ├── Header.js            # Top navigation
│   │   ├── Sidebar.js           # Left sidebar
│   │   ├── SuggestedUsers.js    # User suggestions
│   │   └── TrendingTopics.js    # Trending topics
│   ├── Posts/
│   │   ├── CreatePost.js        # Create new post
│   │   ├── PostCard.js          # Individual post
│   │   ├── PostFeed.js          # Posts timeline
│   │   └── PostActions.js       # Like, comment, share
│   └── UI/
│       └── LoadingSpinner.js    # Loading component
├── contexts/
│   ├── AuthContext.js           # Authentication state
│   └── SocketContext.js         # Socket.IO state
├── lib/
│   └── firebase.js              # Firebase configuration
├── pages/
│   ├── _app.js                  # App wrapper
│   ├── _document.js             # HTML document
│   ├── index.js                 # Landing/Auth page
│   ├── dashboard.js             # Main dashboard
│   └── chat.js                  # Chat interface
├── server/
│   └── index.js                 # Express server
├── styles/
│   └── globals.css              # Global styles
└── package.json
```

## API Endpoints

### REST API
- `GET /api/health` - Server health check
- `GET /api/users/online` - Get online users

### Socket.IO Events

#### Client to Server
- `user_join` - User joins the application
- `private_message` - Send private message
- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

#### Server to Client
- `online_users` - List of online users
- `user_online` - User came online
- `user_offline` - User went offline
- `receive_message` - Receive new message
- `message_sent` - Message delivery confirmation
- `user_typing` - Someone is typing
- `user_stop_typing` - Someone stopped typing

## Features in Detail

### Authentication Flow
1. User visits the app
2. Redirected to login page if not authenticated
3. Google OAuth login via Firebase
4. User data stored in Firebase Auth
5. Redirected to dashboard after successful login

### Real-time Chat
1. Users can see who's online
2. Click on any online user to start a chat
3. Messages are delivered in real-time via Socket.IO
4. Typing indicators show when someone is typing
5. Messages are persisted (can be extended with Firebase)

### Post Management
1. Users can create text posts
2. Posts appear in the feed
3. Users can like, comment, and share posts
4. Real-time updates for engagement

## Deployment

### Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Backend Deployment
- Deploy Express server to Heroku, Railway, or any Node.js hosting
- Update Socket.IO connection URL in SocketContext.js

## Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue on GitHub.

---

Built with ❤️ using Next.js, Express.js, and Firebase
