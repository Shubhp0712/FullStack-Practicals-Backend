# 🔧 Firebase Firestore Setup Guide

## Issue: Permission Denied Errors

If you're seeing "permission denied" errors when trying to send messages, it means Firestore security rules need to be configured. This is a security feature that prevents unauthorized access to your database.

## Solution: Configure Firestore Security Rules

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Select your project: **social-media-app-d78de**

### Step 2: Navigate to Firestore Rules
1. In the left sidebar, click on **"Firestore Database"**
2. Click on the **"Rules"** tab at the top
3. You'll see the current rules (probably set to deny all access)

### Step 3: Update Security Rules
Replace the existing rules with the following code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read all users (for online status)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Allow authenticated users to read/write messages in rooms
    match /rooms/{roomId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write typing indicators
    match /typing/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 4: Publish Rules
1. Click the **"Publish"** button to save the rules
2. Wait for the confirmation message
3. The rules are now active

### Step 5: Test the Application
1. Refresh your SocialChat application
2. Try sending a message
3. Messages should now work properly

## What These Rules Do

### User Documents (`/users/{userId}`)
- **Write**: Users can only modify their own user document
- **Read**: All authenticated users can read user documents (for online status)

### Chat Messages (`/rooms/{roomId}/messages/{messageId}`)
- **Read/Write**: All authenticated users can send and read messages in any room

### Typing Indicators (`/typing/{userId}`)
- **Read/Write**: All authenticated users can set and read typing status

## Security Features

✅ **Authentication Required**: Only signed-in users can access data
✅ **User Privacy**: Users can only edit their own profile
✅ **Chat Access**: Authenticated users can participate in all chat rooms
✅ **Real-time Updates**: Rules allow for live message updates

## Alternative: Test Mode (Not Recommended for Production)

If you want to quickly test without setting up proper rules, you can temporarily use test mode:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

⚠️ **Warning**: Test mode allows anyone to read/write your database. Only use for testing!

## Troubleshooting

### Still Getting Permission Errors?
1. **Clear Browser Cache**: Hard refresh the page (Ctrl+F5)
2. **Check Rules**: Ensure rules were published successfully
3. **Authentication**: Make sure you're signed in to the app
4. **Console Errors**: Check browser console for specific error details

### Rules Not Working?
1. **Syntax Check**: Ensure no syntax errors in the rules
2. **Simulator**: Use Firebase Console's Rules Simulator to test
3. **Logs**: Check Firestore usage logs for rule evaluation details

### Performance Considerations
- These rules are optimized for the chat application
- Read/write operations are limited to authenticated users
- Consider adding rate limiting for production use

## Next Steps

Once rules are configured:
1. ✅ Users can register and sign in
2. ✅ Messages can be sent and received in real-time
3. ✅ Online status tracking works
4. ✅ Multiple chat rooms are accessible
5. ✅ Typing indicators function properly

## Need Help?

If you're still experiencing issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project configuration
3. Ensure you're using the correct project ID
4. Try signing out and back in to refresh authentication tokens

---

**Last Updated**: September 18, 2025
**Version**: 1.0