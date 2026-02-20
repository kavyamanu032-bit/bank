# Troubleshooting Registration Failed

## Common Issues and Solutions

### 1. **Database Tables Not Created**
**Error:** "Database tables not found"

**Solution:**
- Run the database schema: `database/schema.sql` on your Aiven MySQL instance
- See `database/run-schema.md` for instructions

### 2. **Database Connection Failed**
**Error:** "Database connection failed"

**Check:**
- Open `backend/.env` file
- Verify all database credentials are correct:
  - `DB_HOST` - Your Aiven MySQL host
  - `DB_PORT` - Your Aiven MySQL port (usually 12345 or similar)
  - `DB_USER` - Usually `avnadmin` for Aiven
  - `DB_PASSWORD` - Your Aiven MySQL password
  - `DB_NAME` - Your database name (usually `defaultdb`)

### 3. **Backend Server Not Running**
**Error:** Network error or connection refused

**Solution:**
```bash
cd backend
npm run dev
```
Should see: `KodBank API running on http://localhost:3000`

### 4. **Email Already Registered**
**Error:** "Email already registered"

**Solution:** Use a different email address or delete the existing user from the database

### 5. **Check Browser Console**
Open browser DevTools (F12) → Console tab to see detailed error messages

### 6. **Check Backend Logs**
Look at the terminal where `npm run dev` is running for error messages

## Quick Test

1. **Test Database Connection:**
   - Start backend: `cd backend && npm run dev`
   - Look for: `✅ Database connection successful` or error message

2. **Test Registration API:**
   - Open browser DevTools → Network tab
   - Try registering
   - Click on the `/api/auth/register` request
   - Check the Response tab for error details

3. **Verify Environment Variables:**
   ```bash
   cd backend
   # On Windows PowerShell:
   Get-Content .env
   # Should show all DB_* variables filled in
   ```
