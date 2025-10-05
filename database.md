# Ghost X Bot Database Documentation

## Overview
The Ghost X bot uses a JSON-based database system stored in `database.json`. This document provides comprehensive information about the database structure, data types, and how to fetch values.

## Database Structure

### Root Level
```json
{
  "temp_channels": [],
  "users": {}
}
```

## 1. Temporary Channels (`temp_channels`)

### Purpose
Stores IDs of temporary voice channels created by the "Join to Create" feature.

### Data Type
- **Type**: `Array<string>`
- **Description**: Array of Discord channel IDs
- **Example**: `["1234567890123456789", "9876543210987654321"]`

### How to Fetch
```javascript
// Get all temp channel IDs
const tempChannels = client.db.temp_channels;

// Check if a channel is temporary
const isTempChannel = client.db.temp_channels.includes(channelId);

// Get count of temp channels
const tempChannelCount = client.db.temp_channels.length;
```

### Operations
- **Add**: `client.db.temp_channels.push(channelId)`
- **Remove**: `client.db.temp_channels = client.db.temp_channels.filter(id => id !== channelId)`
- **Clear All**: `client.db.temp_channels = []`

## 2. Users (`users`)

### Purpose
Stores comprehensive user activity data, experience points, voice time, messages, and achievements.

### Data Type
- **Type**: `Object<string, UserData>`
- **Key**: Discord User ID (string)
- **Value**: UserData object

### UserData Structure

```typescript
interface UserData {
  level: number;                    // Current user level
  totalExp: number;                 // Total experience points
  todayExp: number;                 // Experience gained today
  lastDailyReset: string;           // Date string of last daily reset
  voiceTime: VoiceTimeData;         // Voice activity data
  messages: MessageData;            // Message activity data
  activities: ActivityData;         // Various activity counters
  achievements: string[];           // Array of achievement IDs
  lastActive: string;               // ISO timestamp of last activity
}

interface VoiceTimeData {
  total: number;                    // Total voice time in minutes
  today: number;                    // Voice time today (calculated)
  sessions: VoiceSession[];         // Array of voice sessions
}

interface VoiceSession {
  joinTime: number;                 // Timestamp when joined
  leaveTime?: number;               // Timestamp when left (undefined if active)
  channelId: string;                // Discord channel ID
  channelName: string;              // Channel name for display
  duration?: number;                // Session duration in minutes
}

interface MessageData {
  daily: Record<string, number>;    // Daily message counts (YYYY-MM-DD format)
  total: number;                    // Total message count
}

interface ActivityData {
  tempChannelsCreated: number;      // Number of temp channels created
  welcomeMessages: number;          // Number of welcome messages sent
  firstJoin: string;                // ISO timestamp of first server join
}
```

## 3. Database Access Methods

### Direct Access
```javascript
// Access entire database
const db = client.db;

// Access users object
const users = client.db.users;

// Access specific user
const user = client.db.users[userId];

// Access temp channels
const tempChannels = client.db.temp_channels;
```

### User Activity Manager Methods

#### Initialize User
```javascript
// Initialize user data (creates if doesn't exist)
const user = client.userActivityManager.initUser(userId);
```

#### Get User Statistics
```javascript
// Get comprehensive user stats
const stats = client.userActivityManager.getUserStats(userId);
// Returns: { level, totalExp, todayExp, levelProgress, voiceTime, messages, activities, lastActive }
```

#### Get Voice Statistics
```javascript
// Get voice time stats for different periods
const voiceStats = client.userActivityManager.getVoiceStats(userId);
// Returns: { '1d': number, '7d': number, '14d': number, total: number }
```

#### Get Message Statistics
```javascript
// Get message stats for different periods
const messageStats = client.userActivityManager.getMessageStats(userId);
// Returns: { '1d': number, '7d': number, '14d': number, total: number }
```

#### Get Leaderboard
```javascript
// Get leaderboard data
const leaderboard = client.userActivityManager.getLeaderboard(type, limit);
// Types: 'level', 'voice', 'messages'
// Returns: Array of user objects sorted by specified criteria
```

## 4. Data Fetching Examples

### Get All Users
```javascript
// Get all user IDs
const userIds = Object.keys(client.db.users);

// Get all user data
const allUsers = Object.values(client.db.users);

// Get user count
const userCount = Object.keys(client.db.users).length;
```

### Get User by Criteria
```javascript
// Get users by level range
const highLevelUsers = Object.entries(client.db.users)
  .filter(([id, user]) => user.level >= 10)
  .map(([id, user]) => ({ userId: id, ...user }));

// Get active users (last 24 hours)
const activeUsers = Object.entries(client.db.users)
  .filter(([id, user]) => {
    const lastActive = new Date(user.lastActive);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return lastActive > dayAgo;
  })
  .map(([id, user]) => ({ userId: id, ...user }));
```

### Get Voice Activity Data
```javascript
// Get all voice sessions for a user
const user = client.db.users[userId];
const voiceSessions = user.voiceTime.sessions;

// Get active voice sessions (no leaveTime)
const activeSessions = voiceSessions.filter(session => !session.leaveTime);

// Get completed sessions
const completedSessions = voiceSessions.filter(session => session.leaveTime);

// Get total voice time for a user
const totalVoiceTime = user.voiceTime.total; // in minutes
```

### Get Message Activity Data
```javascript
// Get message counts for specific dates
const user = client.db.users[userId];
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const todayMessages = user.messages.daily[today] || 0;

// Get all daily message data
const dailyMessages = user.messages.daily;

// Get total messages
const totalMessages = user.messages.total;
```

### Get Activity Counters
```javascript
// Get activity data
const user = client.db.users[userId];
const activities = user.activities;

// Access specific activities
const tempChannelsCreated = activities.tempChannelsCreated;
const welcomeMessages = activities.welcomeMessages;
const firstJoin = activities.firstJoin;
```

## 5. Database Operations

### Save Database
```javascript
// Save database to file
client.saveDB();
// or
client.userActivityManager.saveDB();
```

### Add Experience
```javascript
// Add experience to user
const result = client.userActivityManager.addExp(userId, amount, reason);
// Returns: { leveledUp: boolean, expGained: number, reason: string, oldLevel?, newLevel? }
```

### Track Message
```javascript
// Track a message (adds 15 XP)
const result = client.userActivityManager.trackMessage(userId);
// Returns: { leveledUp: boolean, expGained: number, reason: string, oldLevel?, newLevel? }
```

### Track Voice Time
```javascript
// Track voice time (adds 10 XP per 5 minutes)
const result = client.userActivityManager.trackVoiceTime(userId, minutes);
// Returns: { leveledUp: boolean, expGained: number }
```

### Track Activity
```javascript
// Track specific activity
const result = client.userActivityManager.trackActivity(userId, activityType, expAmount);
// activityType: 'tempChannelsCreated', 'welcomeMessages', etc.
```

## 6. Utility Functions

### Format Duration
```javascript
// Format minutes to human readable string
const formatted = client.userActivityManager.formatDuration(minutes);
// Examples: "0m", "5m", "1h 30m", "2h 15m"
```

### Format Experience
```javascript
// Format experience points
const formatted = client.userActivityManager.formatExp(exp);
// Examples: "150", "1.5K", "2.3M"
```

### Calculate Level
```javascript
// Calculate level from total experience
const level = client.userActivityManager.calculateLevel(totalExp);
// Formula: Math.floor(Math.sqrt(totalExp / 100)) + 1
```

## 7. Database Maintenance

### Cleanup Old Sessions
```javascript
// Clean up voice sessions older than specified days
client.userActivityManager.cleanupOldSessions(userId, days);
// Default: 30 days
```

### Cleanup Stale Channels
```javascript
// Clean up non-existent temp channels from database
const { cleanupStaleChannels } = require('./events/voiceStateUpdate');
await cleanupStaleChannels(client);
```

## 8. Error Handling

### Check if User Exists
```javascript
if (client.db.users[userId]) {
  // User exists
  const user = client.db.users[userId];
} else {
  // User doesn't exist, initialize them
  const user = client.userActivityManager.initUser(userId);
}
```

### Safe Data Access
```javascript
// Safe access with fallbacks
const userLevel = client.db.users[userId]?.level || 1;
const totalExp = client.db.users[userId]?.totalExp || 0;
const voiceTime = client.db.users[userId]?.voiceTime?.total || 0;
```

## 9. Database Schema Validation

### Required Fields Check
```javascript
function validateUserData(userData) {
  const required = ['level', 'totalExp', 'voiceTime', 'messages', 'activities'];
  return required.every(field => userData.hasOwnProperty(field));
}
```

### Data Type Validation
```javascript
function validateUserData(userData) {
  return (
    typeof userData.level === 'number' &&
    typeof userData.totalExp === 'number' &&
    typeof userData.voiceTime === 'object' &&
    typeof userData.messages === 'object' &&
    Array.isArray(userData.voiceTime.sessions) &&
    typeof userData.messages.daily === 'object' &&
    typeof userData.messages.total === 'number'
  );
}
```

## 10. Performance Considerations

### Large Database Handling
```javascript
// For large databases, consider pagination
function getUsersPage(page = 0, limit = 100) {
  const users = Object.entries(client.db.users);
  const start = page * limit;
  const end = start + limit;
  return users.slice(start, end);
}
```

### Memory Optimization
```javascript
// Clean up old message data (older than 15 days)
const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
for (const dateKey in user.messages.daily) {
  if (dateKey < fifteenDaysAgo) {
    delete user.messages.daily[dateKey];
  }
}
```

## 11. Backup and Recovery

### Create Backup
```javascript
const fs = require('fs');
const backup = JSON.stringify(client.db, null, 2);
fs.writeFileSync(`backup_${Date.now()}.json`, backup);
```

### Restore from Backup
```javascript
const backup = JSON.parse(fs.readFileSync('backup_file.json', 'utf8'));
client.db = backup;
client.saveDB();
```

This documentation provides comprehensive information about the Ghost X bot database system, including all data structures, access methods, and best practices for working with the database.