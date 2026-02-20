# How to Run Database Schema

## Method 1: MySQL Command Line Client

If you have MySQL client installed:

```bash
mysql -h YOUR_HOST -P YOUR_PORT -u YOUR_USER -p YOUR_DATABASE < database/schema.sql
```

Replace:
- `YOUR_HOST` - Your Aiven MySQL host (e.g., `my-db.aivencloud.com`)
- `YOUR_PORT` - Your Aiven MySQL port (e.g., `12345`)
- `YOUR_USER` - Your Aiven MySQL username (usually `avnadmin`)
- `YOUR_DATABASE` - Your database name (e.g., `defaultdb`)

Example:
```bash
mysql -h my-db.aivencloud.com -P 12345 -u avnadmin -p defaultdb < database/schema.sql
```

You'll be prompted for your password.

---

## Method 2: Aiven Console SQL Editor (Easiest)

1. Log into [Aiven Console](https://console.aiven.io/)
2. Select your MySQL service
3. Click on **"Query"** or **"SQL Editor"** tab
4. Copy the entire contents of `database/schema.sql`
5. Paste into the SQL editor
6. Click **"Run"** or **"Execute"**

---

## Method 3: MySQL Workbench / DBeaver / Other GUI Tools

1. Open your MySQL GUI tool (MySQL Workbench, DBeaver, TablePlus, etc.)
2. Connect to your Aiven MySQL instance using:
   - Host: Your Aiven host
   - Port: Your Aiven port
   - Username: Your Aiven username
   - Password: Your Aiven password
   - Database: Your database name
3. Open `database/schema.sql` file
4. Execute the SQL (usually F5 or "Run" button)

---

## Method 4: Node.js Script (Alternative)

You can also create a simple Node.js script to run the schema:

```bash
cd backend
node run-schema.js
```

See `database/run-schema.js` for the script.
