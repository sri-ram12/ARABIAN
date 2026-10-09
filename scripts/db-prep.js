const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function prepDatabase() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

  const rootDir = path.resolve(__dirname, '..');
  const prismaDir = path.join(rootDir, 'prisma');
  const targetSchema = path.join(prismaDir, 'schema.prisma');
  const pgSchema = path.join(prismaDir, 'schema.postgresql.prisma');

  console.log('--- Arabian Mandi Database Auto-Detector ---');

  if (isPostgres) {
    console.log('[DB PREP] Cloud PostgreSQL detected in DATABASE_URL.');
    if (fs.existsSync(pgSchema)) {
      fs.copyFileSync(pgSchema, targetSchema);
      console.log('[DB PREP] Successfully switched active schema to PostgreSQL.');
    }
  } else {
    console.log('[DB PREP] Local SQLite detected in DATABASE_URL (or default file:./dev.db).');
  }

  try {
    console.log('[DB PREP] Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });
    console.log('[DB PREP] Prisma Client generated successfully.');
  } catch (err) {
    console.warn('[DB PREP] Prisma client is active or held by dev server. Continuing build.');
  }
}

prepDatabase();
