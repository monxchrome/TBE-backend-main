## Project Goals

The primary goals of this project are:

- **User Registration & Authentication**: Enable users to sign up, log in, and manage their accounts securely.
- **Friend System & Party Creation**: Allow users to add friends and create party groups for collaboration.
- **Real-Time Chat**: Provide a seamless chat experience with online/offline status tracking.
- **Admin Panel**: Implement an admin dashboard with different permission levels for user and system management.
- **Error Management System**: Allow admins to issue error notifications to users.

## Use Cases for Testing

### 1. User Registration & Login
**Scenario:**
- User navigates to the registration page.
- User inputs valid details and submits the form.
- System verifies the data and creates an account.
- User logs in with the registered credentials.
- System grants access and redirects to the dashboard.

**Edge Cases:**
- Attempt to register with an already used email.
- Incorrect password during login.
- Network failure during authentication.

### 2. Adding Friends & Creating Party
**Scenario:**
- User searches for another user by username.
- User sends a friend request.
- Friend request is accepted, and both users appear in each other’s friend lists.
- User creates a party and invites friends.
- Friends join the party, and the system confirms the group creation.

**Edge Cases:**
- Sending a request to a non-existing user.
- Request gets declined.
- User attempts to add an already existing friend.

### 3. Real-Time Chat & Status
**Scenario:**
- User opens the chat window.
- User sends a message to an online friend.
- Friend receives the message instantly.
- User logs out, and their status updates to offline.

**Edge Cases:**
- Message delivery failure due to server issues.
- Friend goes offline mid-conversation.
- Messages are sent in rapid succession to test system load.

### 4. Admin Panel Functionality
**Scenario:**
- Admin logs into the admin panel.
- Admin grants another user admin privileges.
- Admin views the last 5 logins.
- Admin issues an error notification to a specific user.

**Edge Cases:**
- Attempting to assign admin rights to a non-existing user.
- Unauthorized user tries to access the admin panel.
- System error during error issuance.

### 5. Error Notification System
**Scenario:**
- Admin selects a user and issues an "Error: Network Failure" notification.
- User receives a pop-up alert about the error.
- Admin revokes the error notification.

**Edge Cases:**
- User dismisses the error notification without reading it.
- System fails to display the error message.