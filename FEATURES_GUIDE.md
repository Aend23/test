# Features Guide - Unified Inbox Platform

This guide explains how to use all the implemented features of the Unified Inbox platform.

## Table of Contents
1. [Role-Based Access Control](#role-based-access-control)
2. [Message Scheduling](#message-scheduling)
3. [Rich Text Editor](#rich-text-editor)
4. [Message Preview](#message-preview)
5. [@Mentions in Notes](#mentions-in-notes)
6. [Real-Time Presence](#real-time-presence)

---

## 1. Role-Based Access Control (RBAC)

### Overview
The platform has three user roles with different permission levels:

- **VIEWER**: Can view messages, contacts, notes, and analytics
- **EDITOR**: Can do everything a VIEWER can + send messages, schedule messages, and create notes
- **ADMIN**: Full access including user management and contact deletion

### How to Use

#### View Your Role
1. Navigate to any page after logging in
2. Look at the top-right corner in the navigation bar
3. Your role is displayed next to your email (e.g., "user@example.com • ADMIN")

#### Understanding Permissions

**VIEWER Role:**
- ✅ View inbox and all messages
- ✅ View contact details and history
- ✅ View notes (public and their own private notes)
- ✅ View scheduled messages
- ✅ View analytics
- ❌ Cannot send messages
- ❌ Cannot create notes
- ❌ Cannot schedule messages

**EDITOR Role:**
- ✅ All VIEWER permissions
- ✅ Send messages across all channels
- ✅ Schedule messages for future delivery
- ✅ Create notes (public and private)
- ✅ Cancel scheduled messages
- ❌ Cannot manage users or delete contacts

**ADMIN Role:**
- ✅ All EDITOR permissions
- ✅ Manage team members
- ✅ Delete contacts
- ✅ Full system access

#### Permission Denied Messages
If you try to perform an action you don't have permission for, you'll see a message like:
```
"You don't have permission to send messages. Contact your administrator."
```

### Changing User Roles (ADMIN Only)
Currently, roles are set at the database level. To change a user's role:
```sql
UPDATE "User" SET role = 'EDITOR' WHERE email = 'user@example.com';
```

---

## 2. Message Scheduling

### Overview
Schedule messages to be sent automatically at a future date and time. Perfect for follow-ups, reminders, and timed campaigns.

### How to Schedule a Message

#### Step 1: Open Contact or Composer
1. Navigate to **Inbox** page
2. Click on a contact to open their drawer
3. Or use the message composer on any contact page

#### Step 2: Compose Your Message
1. Select the channel (SMS, WhatsApp, or Email)
2. Type your message in the rich text editor
3. For scheduled messages to SMS/WhatsApp, contact must have a phone number

#### Step 3: Set Schedule Time
1. Click the calendar/datetime input field
2. Select a date and time in the future
3. The interface will show "Schedule" button instead of "Send"

#### Step 4: Preview (Optional)
1. If scheduling, a "Preview" button appears
2. Click to see how your message will look
3. Review the channel, scheduled time, and message content
4. Close preview to return to composer

#### Step 5: Schedule
1. Click the "Schedule" button
2. You'll see a confirmation message
3. The message is now queued for delivery

### Viewing Scheduled Messages

#### Navigate to Scheduled Page
1. Click **Scheduled** in the top navigation
2. View all scheduled messages in a list

#### Filter by Status
At the top of the scheduled page, you can filter by:
- **All**: Show all scheduled messages
- **Pending**: Messages waiting to be sent
- **Sent**: Successfully delivered messages
- **Cancelled**: Cancelled scheduled messages

#### Message Details
Each scheduled message card shows:
- Contact name/phone/email
- Channel badge (SMS, WhatsApp, Email)
- Status badge (PENDING, SENT, CANCELLED)
- Full message body
- Scheduled date and time
- Sent date and time (if already sent)
- ⏰ "Upcoming" indicator for pending messages

### Cancelling Scheduled Messages

#### Requirements
- Must have EDITOR or ADMIN role
- Message must be in PENDING status
- Message hasn't been sent yet

#### Steps to Cancel
1. Navigate to **Scheduled** page
2. Find the message you want to cancel
3. Click the red trash icon on the right side
4. Confirm the cancellation in the popup dialog
5. The message status will change to CANCELLED

### Scheduler Process
The scheduler runs automatically and:
- Checks for due messages every minute
- Processes all messages scheduled for the current time or earlier
- Marks messages as SENT after successful delivery
- Marks as CANCELLED if delivery fails (e.g., missing contact info)

---

## 3. Rich Text Editor

### Overview
The enhanced message composer includes a rich text editor with formatting options for better message presentation.

### Available Formatting Options

#### Bold Text
1. Select the text you want to make bold
2. Click the **B** (Bold) button in the toolbar
3. Or use keyboard shortcut: `Ctrl+B` (Windows/Linux) or `Cmd+B` (Mac)

#### Italic Text
1. Select the text you want to italicize
2. Click the **I** (Italic) button in the toolbar
3. Or use keyboard shortcut: `Ctrl+I` (Windows/Linux) or `Cmd+I` (Mac)

#### Bullet Lists
1. Click the list icon in the toolbar
2. Type your list items
3. Press Enter to add new list items

#### Insert Links
1. Select the text you want to turn into a link
2. Click the link icon in the toolbar
3. Enter the URL in the popup
4. Click OK to insert the link

### Character Counter
- Located at the bottom-right of the editor
- Shows real-time character count
- Helps ensure messages stay within channel limits

### Note on SMS/WhatsApp
For SMS and WhatsApp channels, rich formatting is converted to plain text before sending, but the formatting helps with readability during composition.

---

## 4. Message Preview

### Overview
Preview your scheduled messages before they're sent to ensure everything looks correct.

### How to Use Message Preview

#### Accessing Preview
1. Compose a message in the message composer
2. Set a future date/time for scheduling
3. A "Preview" button will appear next to the "Schedule" button
4. Click "Preview" to open the preview modal

#### What You'll See
The preview modal displays:
- **Header**: "Message Preview" with contact context
- **Channel Badge**: Shows which channel (SMS, WhatsApp, Email)
- **Scheduled Time**: Full date and time when message will be sent
- **Recipient**: Contact name or phone/email
- **Message Body**: Full message content in a styled box
- **Character Count**: Total characters in the message

#### Preview Features
- Clean, readable format showing exactly how the message will appear
- HTML formatting is stripped for SMS/WhatsApp preview
- Easy-to-read date/time format
- Channel-specific styling (blue for SMS, green for WhatsApp, purple for Email)

#### Closing Preview
Click the "Close" button or the X icon in the top-right corner to return to the composer.

---

## 5. @Mentions in Notes

### Overview
Mention team members in notes using the @ symbol to notify them and draw their attention to important information.

### How to Use @Mentions

#### Adding a Mention
1. Open a contact's drawer
2. Scroll to the Notes section
3. Start typing a note
4. Type `@` followed by the team member's name
5. A dropdown will appear showing matching team members

#### Selecting from Dropdown
1. The dropdown shows up to 5 matching team members
2. Each entry shows:
   - User avatar icon
   - Full name (if available)
   - Email address
3. Click on a team member to insert their mention
4. The mention will be inserted as `@Name` in your note

#### Autocomplete
- As you type after `@`, the dropdown filters results
- Matches against both name and email
- Case-insensitive search
- Press `Escape` to close dropdown without selecting

#### Mention Display
Once you save a note with mentions:
- Mentions appear with a blue highlight background
- Format: `@Name` in indigo color
- Easy to spot when reviewing notes
- Visually distinguishable from regular text

### Use Cases for @Mentions
- **Handoffs**: "@John please follow up on this lead"
- **Assignments**: "@Sarah can you review this customer issue?"
- **FYI**: "@Team this contact requested a callback"
- **Escalations**: "@Manager urgent: customer complaint"

### Team Member List
- Mentions search through your team members
- If you're part of a team, only team members are shown
- If no team is assigned, all users in the system can be mentioned
- Maximum 50 users shown in the dropdown

---

## 6. Real-Time Presence

### Overview
See who else is currently viewing or editing the same contact in real-time, enabling better team coordination.

### How It Works

#### Automatic Presence Detection
When you open a contact's drawer:
1. Your presence is automatically broadcast to other team members
2. Other viewers are notified that you've joined
3. You see a list of everyone currently viewing the same contact
4. When you close the drawer, your presence is removed

#### Presence Indicator
Located in the contact drawer header (purple gradient section):
- Shows a purple badge with the Users icon
- Displays text like:
  - "John Smith is viewing" (1 person)
  - "2 people viewing" (multiple people)
- Appears only when other users are present

#### Real-Time Updates
- Instant notification when someone joins
- Instant notification when someone leaves
- No page refresh needed
- Uses Pusher WebSocket for real-time communication

### Use Cases

#### Avoid Duplicate Work
Before calling a contact, check if someone else is already engaging with them.

#### Collaborative Notes
If you see a colleague viewing the same contact, you can coordinate on adding notes or following up.

#### Team Awareness
Know when your team is actively working on high-priority contacts.

#### Handoff Coordination
Smoothly hand off contacts between team members with real-time visibility.

### Technical Details
- Presence is per-contact (each contact has its own presence channel)
- Presence is temporary (cleared when drawer is closed or browser is closed)
- Powered by Pusher's real-time infrastructure
- Works across multiple browser tabs and devices

---

## Common Workflows

### 1. Schedule a Follow-Up Message
```
1. Open contact from inbox
2. Click in the composer
3. Write: "Hi @Contact, following up on our conversation..."
4. Select SMS or WhatsApp
5. Set datetime to tomorrow at 10 AM
6. Click "Preview" to review
7. Click "Schedule"
8. Navigate to Scheduled page to verify
```

### 2. Add a Note with Team Mention
```
1. Open contact drawer
2. Scroll to Notes section
3. Type: "Customer requested callback @John please follow up"
4. See @John appear in the dropdown
5. Click to select @John
6. Choose visibility (Public/Private)
7. Click "Add Note"
8. Note appears with @John highlighted
```

### 3. Check Who's Working on a Contact
```
1. Open contact from inbox
2. Look at the purple header section
3. If presence indicator shows, others are viewing
4. Coordinate via team chat or proceed with caution
5. Your presence is visible to them too
```

### 4. Cancel an Outdated Scheduled Message
```
1. Navigate to Scheduled page
2. Filter by "Pending" if needed
3. Find the message to cancel
4. Click the red trash icon
5. Confirm cancellation
6. Status changes to CANCELLED
```

---

## Troubleshooting

### "You don't have permission" Message
**Solution**: Your role doesn't allow this action. Contact your administrator to upgrade your role if needed.

### Scheduled Messages Not Sending
**Checklist**:
- Is the scheduler process running? Check with admin
- Is the scheduled time in the future?
- Does the contact have a valid phone number (for SMS/WhatsApp)?
- Check the scheduled messages page for status

### @Mentions Dropdown Not Appearing
**Checklist**:
- Are you typing `@` followed by characters?
- Are there team members in your team?
- Try typing more characters after `@`

### Presence Not Showing
**Checklist**:
- Are Pusher credentials configured correctly?
- Is another user actually viewing the same contact?
- Try refreshing the page

### Rich Text Formatting Lost
**Note**: SMS and WhatsApp don't support rich text. Formatting is automatically stripped before sending but helps during composition.

---

## Best Practices

### Role Management
- Assign VIEWER role to new team members initially
- Promote to EDITOR after training
- Keep ADMIN role limited to managers

### Message Scheduling
- Schedule during business hours for better engagement
- Use clear, professional language
- Preview all scheduled messages before confirming
- Regularly review pending scheduled messages

### Notes & Mentions
- Use @mentions for actionable items
- Keep notes concise and specific
- Use Private visibility for sensitive information
- Use Public for team-wide context

### Real-Time Collaboration
- Check presence before engaging with a contact
- Coordinate with team members if multiple people are viewing
- Use notes to communicate asynchronously

---

## Support

For technical issues or feature requests, contact your system administrator.

For general questions about using the platform, refer to this guide or reach out to your team lead.

**Version**: 1.0  
**Last Updated**: November 2024
