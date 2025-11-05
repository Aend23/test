# Setup Instructions

## Prerequisites
- PostgreSQL database running
- Node.js 18+ installed
- Pusher account (for real-time features)
- Twilio account (for SMS/WhatsApp)

## Step 1: Environment Variables

Create a `.env` file in the `/app` directory with the following variables:

```bash
# Copy from .env.example
cp .env.example .env
```

Then edit `.env` and fill in your actual credentials:

### Required Variables:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/unified_inbox?schema=public"

# Pusher (Real-time features)
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Better Auth
BETTER_AUTH_SECRET=your_secret_key_here_min_32_characters_long
BETTER_AUTH_URL=http://localhost:3000
```

### Optional Variables:
```env
# Google OAuth (if using Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 2: Install Dependencies

```bash
cd /app
yarn install
```

## Step 3: Database Setup

### Generate Prisma Client
```bash
npx prisma generate
```

### Run Migrations
```bash
npx prisma migrate dev
```

### Create Initial Admin User (Optional)
```bash
npx prisma db seed
```

Or manually via SQL:
```sql
INSERT INTO "User" (id, email, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'cuid_generate_here',
  'admin@example.com',
  'Admin User',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

## Step 4: Build the Application

```bash
npm run build
```

## Step 5: Run the Application

### Development Mode
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Production Mode
```bash
npm run build
npm start
```

## Step 6: Setup Message Scheduler (Optional but Recommended)

The scheduler processes scheduled messages. Run it in a separate terminal:

```bash
npm run scheduler
```

Or set it up as a system service (Linux):

```bash
# Create systemd service
sudo nano /etc/systemd/system/unified-inbox-scheduler.service
```

Add:
```ini
[Unit]
Description=Unified Inbox Message Scheduler
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/app
ExecStart=/usr/bin/npm run scheduler
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable unified-inbox-scheduler
sudo systemctl start unified-inbox-scheduler
```

## Step 7: Verify Setup

### Check Database Connection
```bash
npx prisma studio
```
This opens a web UI to browse your database.

### Test Pusher Connection
1. Open the app in two browsers
2. Open the same contact in both
3. You should see "X people viewing" indicator

### Test Message Sending
1. Login to the app
2. Open a contact
3. Send a test SMS (if you have Twilio trial, only verified numbers work)

### Test Scheduling
1. Schedule a message for 2 minutes in the future
2. Navigate to Scheduled page
3. After 2 minutes, check if status changed to SENT

## Troubleshooting

### Error: "Missing Pusher configuration"
- Check that ALL Pusher environment variables are set
- Both server-side (PUSHER_*) and client-side (NEXT_PUBLIC_PUSHER_*)
- Rebuild the app after adding variables

### Error: "Prisma Client not generated"
Run:
```bash
npx prisma generate
```

### Scheduler not processing messages
- Ensure the scheduler script is running
- Check logs for errors
- Verify DATABASE_URL is correct
- Check that scheduled messages exist in database:
```sql
SELECT * FROM "ScheduledMessage" WHERE status = 'PENDING';
```

### Messages not sending via Twilio
- Verify Twilio credentials are correct
- For trial accounts, ensure recipient number is verified in Twilio console
- Check Twilio dashboard for error logs

### Real-time features not working
- Verify Pusher credentials
- Check browser console for WebSocket errors
- Ensure firewall allows WebSocket connections

## Getting Service Credentials

### Pusher
1. Sign up at https://pusher.com
2. Create a new Channels app
3. Go to "App Keys" tab
4. Copy App ID, Key, Secret, and Cluster

### Twilio
1. Sign up at https://www.twilio.com/try-twilio
2. Go to Console Dashboard
3. Copy Account SID and Auth Token
4. Buy a phone number or use trial number
5. For WhatsApp: Setup WhatsApp Sandbox

### PostgreSQL (if not installed)
#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb unified_inbox
```

#### macOS:
```bash
brew install postgresql
brew services start postgresql
createdb unified_inbox
```

#### Docker:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=unified_inbox -p 5432:5432 -d postgres:15
```

## Default User Roles

After creating users, you can update roles via Prisma Studio or SQL:

```sql
-- Make user an ADMIN
UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';

-- Make user an EDITOR
UPDATE "User" SET role = 'EDITOR' WHERE email = 'user@example.com';

-- Make user a VIEWER
UPDATE "User" SET role = 'VIEWER' WHERE email = 'user@example.com';
```

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong secrets for `BETTER_AUTH_SECRET`
- Update `BETTER_AUTH_URL` to your production domain

### Security
- Enable HTTPS
- Use environment variables, never commit secrets
- Restrict database access to app server only
- Enable rate limiting
- Set up monitoring and logging

### Scaling
- Run multiple Next.js instances behind a load balancer
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- Run scheduler on a separate instance
- Use Redis for session storage (optional optimization)

## Next Steps

1. Read the [FEATURES_GUIDE.md](./FEATURES_GUIDE.md) to learn how to use all features
2. Customize the app branding (logo, colors) in `app/layout.tsx`
3. Set up monitoring and alerting
4. Configure backups for the database
5. Train your team on the platform

## Support

For issues:
1. Check this guide first
2. Review application logs
3. Check database for data issues with Prisma Studio
4. Verify all environment variables are set correctly

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Pusher Documentation](https://pusher.com/docs)
- [Twilio Documentation](https://www.twilio.com/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
