document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userAvatar = document.getElementById('userAvatar');
    const fullName = document.getElementById('fullName');
    const emailAddress = document.getElementById('emailAddress');
    const phoneNumber = document.getElementById('phoneNumber');
    const memberSince = document.getElementById('memberSince');

    // Check authentication and load user data
    checkAuthAndLoadUser();

    // Logout functionality
    logoutBtn.addEventListener('click', async function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: currentUser.email })
            });

            // Clear localStorage regardless of server response
            localStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear localStorage and redirect
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });

    async function checkAuthAndLoadUser() {
        const currentUser = localStorage.getItem('currentUser');
        
        if (!currentUser) {
            // No user data, redirect to login
            window.location.href = 'login.html';
            return;
        }

        try {
            const user = JSON.parse(currentUser);
            
            // Check if user is still authenticated on server
            const response = await fetch('/api/check-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email })
            });

            const result = await response.json();
            
            if (!result.success || !result.isLoggedIn) {
                // User is not authenticated, redirect to login
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
                return;
            }

            // Load user data into dashboard
            loadUserData(result.user);
            
        } catch (error) {
            console.error('Auth check error:', error);
            // Clear invalid user data and redirect
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }

    function loadUserData(user) {
        // Update welcome message
        welcomeMessage.textContent = `Welcome back, ${user.firstName}! 🎉`;
        
        // Update avatar with initials
        const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
        userAvatar.textContent = initials;
        
        // Update user information
        fullName.textContent = `${user.firstName} ${user.lastName}`;
        emailAddress.textContent = user.email;
        phoneNumber.textContent = user.phone || 'Not provided';
        
        // Format and display member since date
        const memberDate = new Date(user.createdAt);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        memberSince.textContent = memberDate.toLocaleDateString('en-US', options);
    }

    // Add click handlers for action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            
            // Simple alert for demo purposes
            alert(`${action} feature coming soon!`);
            
            // In a real application, you would implement these features:
            // - Edit Profile: Open a profile editing form
            // - Change Password: Open a password change form
            // - Settings: Navigate to settings page
            // - Help Center: Open help documentation
        });
    });
});