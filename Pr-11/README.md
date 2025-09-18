# SocialChat - Real-time Social Media Chat Application

A modern, feature-rich social media chat application built with Firebase, featuring real-time messaging, Google authentication, and a beautiful responsive UI.

## 🚀 Features

### Authentication
- **Email/Password Authentication** - Secure user registration and login
- **Google OAuth Integration** - One-click login with Google account
- **User Profile Management** - Display names and profile pictures
- **Session Management** - Persistent login state

### Real-time Chat
- **Multiple Chat Rooms** - General, Random, and Tech Talk rooms
- **Live Messaging** - Instant message delivery using Firestore
- **Typing Indicators** - See when users are typing
- **Message History** - Persistent chat history
- **User Presence** - Online/offline status tracking

### Modern UI Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Automatic dark mode based on system preference
- **Emoji Picker** - Rich emoji support with categorized picker
- **Toast Notifications** - User-friendly feedback messages
- **Smooth Animations** - Modern CSS animations and transitions
- **Professional Design** - Clean, modern social media interface

### Additional Features
- **Online Users List** - See who's currently online
- **Character Counter** - 500 character limit with live counter
- **URL Detection** - Automatic link conversion in messages
- **Keyboard Shortcuts** - Enter to send, Ctrl+Enter for new line
- **Error Handling** - Comprehensive error handling and user feedback

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore, Analytics)
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Cloud Firestore (NoSQL, real-time)
- **Hosting**: Express.js server for development
- **UI Framework**: Custom CSS with modern design principles

## 📁 Project Structure

```
pr-11/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling
├── firebase-config.js  # Firebase configuration and initialization
├── auth.js            # Authentication management
├── chat.js            # Chat functionality and real-time features
├── app.js             # Main application logic and utilities
├── server.js          # Express server for development
└── README.md          # This file
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js installed on your system
- Firebase project with authentication and Firestore enabled
- Modern web browser with JavaScript enabled

### Installation
1. **Navigate to the pr-11 directory**:
   ```bash
   cd "f:\Programming\SEM 5 all sub\Full Stack web\Backend_practical\pr-11"
   ```

2. **Start the development server**:
   ```bash
   node server.js
   ```

3. **Open the application**:
   - Go to `http://localhost:3011` in your web browser
   - The application will automatically load

### Firebase Configuration
The application is pre-configured with Firebase credentials:
- **Project ID**: social-media-app-d78de
- **Auth Domain**: social-media-app-d78de.firebaseapp.com
- **Google OAuth**: Enabled and configured

## 📱 How to Use

### Getting Started
1. **Open the application** in your web browser at `http://localhost:3011`
2. **Create an account** or **sign in**:
   - Use email/password registration
   - Or click "Continue with Google" for instant access

### 💬 How to Chat with Someone - Complete Guide

#### Step 1: Authentication
1. **Register/Login**: 
   - New users: Fill out the registration form with email/password
   - Existing users: Use the login form
   - Quick option: Click "Continue with Google" for instant access

#### Step 2: Understanding the Interface
Once logged in, you'll see:
- **Left Sidebar**: Chat rooms and online users
- **Main Area**: Message feed for the selected room
- **Bottom**: Message input area with emoji picker
- **Top Right**: Your profile and logout option

#### Step 3: Selecting a Chat Room
Choose from available rooms in the left sidebar:
- **🌍 General Chat**: Main discussion room for everyone
- **🎲 Random**: Casual conversations and random topics  
- **💻 Tech Talk**: Technology and programming discussions

#### Step 4: Starting a Conversation
1. **Click on any chat room** to enter it
2. **Type your message** in the input field at the bottom
3. **Add emojis** by clicking the 😀 button
4. **Send your message** by pressing Enter

#### Step 5: Real-time Interaction
- **See who's online**: Check the "Online Users" section in sidebar
- **Know when someone is typing**: Watch for typing indicators below messages
- **Get instant replies**: Messages appear immediately when sent
- **Switch rooms anytime**: Click different room names to change conversations

#### Step 6: Advanced Chat Features
1. **Emoji Reactions**: 
   - Click the emoji picker button (😀)
   - Browse categories: People, Nature, Food, etc.
   - Click any emoji to insert into your message

2. **Message Formatting**:
   - Type normally for regular text
   - URLs are automatically converted to clickable links
   - Use Shift+Enter for line breaks within messages

3. **User Presence**:
   - See green dots next to online users
   - Your status automatically updates when active
   - Others can see when you're typing

### 🤝 How Multiple Users Chat Together

#### Scenario: Group Conversation
1. **User A joins General Chat**
2. **User B enters the same room**
3. **Both users see each other in "Online Users"**
4. **User A types**: "Hello everyone!"
5. **User B sees the message instantly**
6. **User B replies**: "Hi! How are you?"
7. **Both users continue the conversation in real-time**

#### Multi-Room Conversations
- **Users can be in different rooms simultaneously**
- **Each room maintains its own conversation thread**
- **Switch between rooms to participate in multiple discussions**
- **Message history is preserved in each room**

#### Example Chat Flow:
```
General Chat Room:
[10:30 AM] Alice: Good morning everyone! 👋
[10:31 AM] Bob: Hey Alice! How's your project going?
[10:32 AM] Alice: Really well! Just finished the authentication part
[10:32 AM] Charlie joined the chat
[10:33 AM] Charlie: Hi guys! What are we talking about?
[10:33 AM] Bob: Alice is working on a cool project!
```

### 🎯 Chat Interaction Tips

#### For New Users:
1. **Start with General Chat** - Most active room
2. **Introduce yourself** - Say hello to break the ice
3. **Read recent messages** - Get context of ongoing conversations
4. **Use emojis** - Make conversations more engaging

#### For Active Chatting:
1. **Stay in one room** for focused conversations
2. **Use @mentions** by typing someone's name
3. **Share links** - URLs become clickable automatically
4. **Be responsive** - Reply to others' messages

#### Managing Conversations:
1. **Check online users** before starting important discussions
2. **Switch rooms** based on topic relevance
3. **Use typing indicators** to know when to wait for responses
4. **Refresh page** if you experience any connection issues

### 🔄 Real-time Features Explanation

#### Live Messaging:
- **Instant delivery**: Messages appear immediately across all connected devices
- **No refresh needed**: New messages auto-appear in chat
- **Cross-device sync**: Login from multiple devices, see same conversations

#### Presence System:
- **Online status**: Green dot shows who's currently active
- **Last seen**: Automatic tracking of user activity
- **Typing indicators**: "User is typing..." shows live typing status

#### Message Persistence:
- **Chat history**: All messages saved and retrievable
- **Login anywhere**: Access your conversations from any device
- **Room memory**: Each room remembers its conversation history

### User Interaction
- **View online users** in the sidebar
- **See typing indicators** when others are typing  
- **Switch between rooms** by clicking room names
- **Logout** using the logout button in the header

## 🎨 UI Features

### Responsive Design
- **Desktop**: Full sidebar with user list and room navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Mobile-first design with touch-friendly interface

### Visual Elements
- **Gradient backgrounds** with modern color schemes
- **Glass morphism effects** for modern appearance
- **Smooth animations** for all interactions
- **Professional typography** using Inter font family
- **Custom scrollbars** for better UX

### Accessibility
- **Keyboard navigation** support
- **Focus indicators** for screen readers
- **High contrast mode** support
- **Reduced motion** respect for accessibility preferences

## 🔐 Security Features

### Authentication Security
- **Firebase Auth** handles all security aspects
- **Secure token management** with automatic refresh
- **Google OAuth** provides additional security layer
- **Session persistence** with secure token storage

### Data Security
- **Firestore security rules** protect user data
- **Real-time validation** prevents malicious input
- **XSS protection** through proper HTML escaping
- **HTTPS enforcement** for all Firebase communications

## 🚀 Performance Features

### Optimization
- **Lazy loading** of non-critical resources
- **Efficient DOM updates** with minimal repaints
- **Debounced typing indicators** to reduce server calls
- **Message batching** for optimal Firestore usage

### Caching
- **Firebase SDK caching** for offline capability
- **Static asset caching** through proper headers
- **Component state management** for smooth UX

## 🌐 Browser Support

### Supported Browsers
- **Chrome** 90+ (Recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### Required Features
- **ES6+ JavaScript** support
- **CSS Grid and Flexbox** support
- **WebSocket** connection capability
- **LocalStorage** for session management

## 🔧 Development

### Code Structure
- **Modular JavaScript** with ES6 modules
- **Component-based architecture** for maintainability
- **Event-driven programming** for real-time features
- **Responsive CSS** with custom properties

### Firebase Integration
- **Real-time listeners** for live updates
- **Optimistic UI updates** for better UX
- **Error handling** with user-friendly messages
- **Offline support** through Firebase caching

## 📊 Analytics

The application includes Firebase Analytics to track:
- **User engagement** and session duration
- **Feature usage** and popular chat rooms
- **Error tracking** for continuous improvement
- **Performance monitoring** for optimization

## 🤝 Contributing

To contribute to this project:
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes** following the coding standards
4. **Test thoroughly** across different browsers
5. **Submit a pull request** with detailed description

## 📄 License

This project is developed for educational purposes as part of the Full Stack Web Development practical exercises.

## 🆘 Support

### Common Issues
1. **Authentication not working**: Check internet connection and Firebase configuration
2. **Messages not appearing**: Verify Firestore rules and permissions
3. **Google login failed**: Ensure popup blockers are disabled
4. **UI not responsive**: Clear browser cache and reload

### Contact
For technical support or questions about this project, please refer to the course materials or contact your instructor.

---

**Built with ❤️ for Full Stack Web Development - SEM 5**

*Last updated: September 18, 2025*