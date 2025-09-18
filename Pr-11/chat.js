// Chat Management System
import { db, auth } from './firebase-config.js';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    serverTimestamp,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    where,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class ChatManager {
    constructor() {
        this.currentUser = null;
        this.currentRoom = 'general';
        this.messages = new Map();
        this.users = new Map();
        this.unsubscribers = [];
        this.typingTimeout = null;
        this.lastTypingTime = 0;

        this.emojis = {
            smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
            people: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝'],
            nature: ['🌳', '🌲', '🌴', '🌵', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🌾', '🌺', '🌻', '🌸', '🌼', '🌷', '🥀', '🌹', '🏵️', '💐', '🌱', '🌿', '🌾', '🌵', '🌴', '🌳', '🌲', '🍄'],
            food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔'],
            activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️'],
            travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞'],
            objects: ['💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧲', '🔫', '💣'],
            symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐']
        };
    }

    async init(user) {
        this.currentUser = user;
        await this.setupUserPresence();
        this.setupRealTimeListeners();
        this.setupMessageInput();
        this.initializeEmojiPicker();
        this.setupRoomSwitching();
    }

    async setupUserPresence() {
        if (!this.currentUser) return;

        try {
            const userRef = doc(db, 'users', this.currentUser.uid);

            // Set user as online
            await setDoc(userRef, {
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                email: this.currentUser.email,
                photoURL: this.currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.displayName || this.currentUser.email)}&background=667eea&color=fff`,
                isOnline: true,
                lastSeen: serverTimestamp()
            }, { merge: true });

            // Set user as offline when they leave
            window.addEventListener('beforeunload', () => {
                updateDoc(userRef, {
                    isOnline: false,
                    lastSeen: serverTimestamp()
                });
            });

            // Heartbeat to maintain online status
            setInterval(async () => {
                if (this.currentUser) {
                    try {
                        await updateDoc(userRef, {
                            lastSeen: serverTimestamp()
                        });
                    } catch (error) {
                        console.error('Error updating heartbeat:', error);
                    }
                }
            }, 30000); // Every 30 seconds

        } catch (error) {
            console.error('Error setting up user presence:', error);
            if (error.code === 'permission-denied') {
                window.authManager.showToast('User presence setup failed. Please configure Firestore rules.', 'warning');
            }
        }
    }

    setupRealTimeListeners() {
        // Listen to messages in current room
        this.listenToMessages();

        // Listen to online users
        this.listenToUsers();
    }

    listenToMessages() {
        if (this.messagesUnsubscriber) {
            this.messagesUnsubscriber();
        }

        const messagesRef = collection(db, 'rooms', this.currentRoom, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

        this.messagesUnsubscriber = onSnapshot(messagesQuery, (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });

            this.messages.set(this.currentRoom, messages);
            this.renderMessages();
        }, (error) => {
            console.error('Error listening to messages:', error);
            if (error.code === 'permission-denied') {
                this.renderPermissionError();
            } else {
                window.authManager.showToast('Failed to load messages', 'error');
            }
        });
    }

    renderPermissionError() {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = `
            <div class="permission-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Setup Required</h3>
                <p>Firestore security rules need to be configured to enable real-time messaging.</p>
                <button onclick="window.chatManager.showFirestoreSetupInstructions()" class="setup-btn">
                    <i class="fas fa-cog"></i>
                    Show Setup Instructions
                </button>
            </div>
        `;
    }

    listenToUsers() {
        const usersRef = collection(db, 'users');
        const usersQuery = query(usersRef, where('isOnline', '==', true));

        const unsubscriber = onSnapshot(usersQuery, (snapshot) => {
            const users = [];
            snapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.uid !== this.currentUser.uid) {
                    users.push({ id: doc.id, ...userData });
                }
            });

            this.renderOnlineUsers(users);
        });

        this.unsubscribers.push(unsubscriber);
    }

    renderMessages() {
        const container = document.getElementById('messagesContainer');
        const messages = this.messages.get(this.currentRoom) || [];

        // Clear welcome message
        container.innerHTML = '';

        if (messages.length === 0) {
            container.innerHTML = `
                <div class="welcome-message">
                    <i class="fas fa-comments"></i>
                    <h3>Welcome to ${this.getRoomName(this.currentRoom)}!</h3>
                    <p>Be the first to start the conversation.</p>
                </div>
            `;
            return;
        }

        messages.forEach((message, index) => {
            const messageEl = this.createMessageElement(message, index > 0 ? messages[index - 1] : null);
            container.appendChild(messageEl);
        });

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    createMessageElement(message, previousMessage) {
        const messageDiv = document.createElement('div');
        const isOwn = message.userId === this.currentUser.uid;
        const showAvatar = !previousMessage || previousMessage.userId !== message.userId;

        messageDiv.className = `message ${isOwn ? 'own' : ''}`;

        const time = message.timestamp ?
            new Date(message.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
            'Sending...';

        messageDiv.innerHTML = `
            ${showAvatar ? `
                <div class="message-avatar">
                    <img src="${message.userPhoto}" alt="${message.userName}" />
                </div>
            ` : ''}
            <div class="message-content">
                ${showAvatar ? `
                    <div class="message-header">
                        <span class="message-author">${message.userName}</span>
                        <span class="message-time">${time}</span>
                    </div>
                ` : ''}
                <div class="message-text">${this.formatMessageText(message.text)}</div>
            </div>
        `;

        return messageDiv;
    }

    formatMessageText(text) {
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

        // Convert line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    renderOnlineUsers(users) {
        const container = document.getElementById('usersList');
        const countElement = document.getElementById('onlineCount');

        countElement.textContent = users.length + 1; // +1 for current user

        container.innerHTML = `
            <div class="user-item current-user">
                <img src="${this.currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.displayName || this.currentUser.email)}&background=667eea&color=fff`}" alt="You" />
                <div class="user-info">
                    <span class="user-name">You</span>
                    <span class="user-status online">Online</span>
                </div>
            </div>
        `;

        users.forEach(user => {
            const userEl = document.createElement('div');
            userEl.className = 'user-item';
            userEl.innerHTML = `
                <img src="${user.photoURL}" alt="${user.displayName}" />
                <div class="user-info">
                    <span class="user-name">${user.displayName}</span>
                    <span class="user-status online">Online</span>
                </div>
            `;
            container.appendChild(userEl);
        });
    }

    setupMessageInput() {
        const messageInput = document.getElementById('messageInput');
        const characterCount = document.getElementById('characterCount');
        const sendBtn = document.getElementById('sendBtn');

        messageInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            characterCount.textContent = `${length}/500`;

            // Enable/disable send button
            sendBtn.disabled = length === 0;

            // Handle typing indicator
            this.handleTyping();
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();

        if (!text || !this.currentUser) return;

        try {
            const messagesRef = collection(db, 'rooms', this.currentRoom, 'messages');

            await addDoc(messagesRef, {
                text: text,
                userId: this.currentUser.uid,
                userName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                userPhoto: this.currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.displayName || this.currentUser.email)}&background=667eea&color=fff`,
                timestamp: serverTimestamp()
            });

            messageInput.value = '';
            document.getElementById('characterCount').textContent = '0/500';
            document.getElementById('sendBtn').disabled = true;

        } catch (error) {
            console.error('Error sending message:', error);

            if (error.code === 'permission-denied') {
                window.authManager.showToast('⚠️ Firestore permissions not configured. Please set up security rules.', 'error');
                this.showFirestoreSetupInstructions();
            } else if (error.code === 'failed-precondition') {
                window.authManager.showToast('Database not properly initialized. Please check Firestore setup.', 'error');
            } else {
                window.authManager.showToast('Failed to send message. Please try again.', 'error');
            }
        }
    }

    showFirestoreSetupInstructions() {
        const instructions = `
🔧 FIRESTORE SETUP REQUIRED

To enable messaging, please follow these steps:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: social-media-app-d78de
3. Go to Firestore Database
4. Click on "Rules" tab
5. Replace the rules with this code:

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

6. Click "Publish" to save the rules
7. Refresh this page and try sending a message again
        `;

        console.log(instructions);

        // Show in a modal-like toast
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast toast-info setup-instructions';
        toast.innerHTML = `
            <div class="setup-content">
                <h3>🔧 Firestore Setup Required</h3>
                <p>To enable messaging, please configure Firestore security rules:</p>
                <ol>
                    <li>Go to <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a></li>
                    <li>Select project: <strong>social-media-app-d78de</strong></li>
                    <li>Go to <strong>Firestore Database → Rules</strong></li>
                    <li>Copy the rules from browser console</li>
                    <li>Click <strong>Publish</strong> to save</li>
                </ol>
                <button onclick="this.closest('.toast').remove()" class="setup-close">Got it!</button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 15 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 15000);
    }

    handleTyping() {
        if (!this.currentUser) return;

        this.lastTypingTime = Date.now();

        if (!this.typingTimeout) {
            // User started typing
            this.setTypingStatus(true);

            this.typingTimeout = setTimeout(() => {
                if (Date.now() - this.lastTypingTime >= 1000) {
                    this.setTypingStatus(false);
                    this.typingTimeout = null;
                }
            }, 1000);
        }
    }

    async setTypingStatus(isTyping) {
        if (!this.currentUser) return;

        try {
            const typingRef = doc(db, 'typing', this.currentUser.uid);

            if (isTyping) {
                await setDoc(typingRef, {
                    userId: this.currentUser.uid,
                    userName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                    room: this.currentRoom,
                    timestamp: serverTimestamp()
                });
            } else {
                await deleteDoc(typingRef);
            }
        } catch (error) {
            console.error('Error updating typing status:', error);
        }
    }

    setupRoomSwitching() {
        const roomItems = document.querySelectorAll('.room-item');

        roomItems.forEach(item => {
            item.addEventListener('click', () => {
                const roomId = item.dataset.room;
                this.switchRoom(roomId);
            });
        });
    }

    switchRoom(roomId) {
        if (roomId === this.currentRoom) return;

        // Update UI
        document.querySelectorAll('.room-item').forEach(item => {
            item.classList.remove('active');
        });

        document.querySelector(`[data-room="${roomId}"]`).classList.add('active');

        // Update room title
        document.getElementById('currentRoomTitle').innerHTML = `
            <i class="fas fa-${this.getRoomIcon(roomId)}"></i>
            ${this.getRoomName(roomId)}
        `;

        // Switch room
        this.currentRoom = roomId;
        this.listenToMessages();
    }

    getRoomName(roomId) {
        const names = {
            general: 'General Chat',
            random: 'Random',
            tech: 'Tech Talk'
        };
        return names[roomId] || roomId;
    }

    getRoomIcon(roomId) {
        const icons = {
            general: 'comments',
            random: 'random',
            tech: 'code'
        };
        return icons[roomId] || 'comments';
    }

    initializeEmojiPicker() {
        const emojiGrid = document.getElementById('emojiGrid');
        const emojiCategories = document.querySelectorAll('.emoji-category');

        // Load default category
        this.loadEmojiCategory('smileys');

        // Setup category switching
        emojiCategories.forEach(btn => {
            btn.addEventListener('click', () => {
                emojiCategories.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadEmojiCategory(btn.dataset.category);
            });
        });
    }

    loadEmojiCategory(category) {
        const emojiGrid = document.getElementById('emojiGrid');
        const emojis = this.emojis[category] || [];

        emojiGrid.innerHTML = '';

        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.className = 'emoji-btn';
            emojiBtn.textContent = emoji;
            emojiBtn.addEventListener('click', () => {
                this.insertEmoji(emoji);
            });
            emojiGrid.appendChild(emojiBtn);
        });
    }

    insertEmoji(emoji) {
        const messageInput = document.getElementById('messageInput');
        const currentValue = messageInput.value;
        const cursorPos = messageInput.selectionStart;

        const newValue = currentValue.slice(0, cursorPos) + emoji + currentValue.slice(cursorPos);
        messageInput.value = newValue;

        // Update character count
        const length = newValue.length;
        document.getElementById('characterCount').textContent = `${length}/500`;

        // Move cursor after emoji
        messageInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
        messageInput.focus();

        // Hide emoji picker
        document.getElementById('emojiPicker').classList.add('hidden');
    }

    clearChat() {
        if (confirm('Are you sure you want to clear all messages in this room?')) {
            // This would require admin permissions in a real app
            window.authManager.showToast('Clear chat feature requires admin permissions', 'info');
        }
    }

    destroy() {
        // Clean up listeners
        this.unsubscribers.forEach(unsubscriber => unsubscriber());
        if (this.messagesUnsubscriber) {
            this.messagesUnsubscriber();
        }

        // Set user as offline
        if (this.currentUser) {
            const userRef = doc(db, 'users', this.currentUser.uid);
            updateDoc(userRef, {
                isOnline: false,
                lastSeen: serverTimestamp()
            });
        }
    }
}

// Initialize chat manager
const chatManager = new ChatManager();

// Export for global access
window.chatManager = chatManager;

export default chatManager;