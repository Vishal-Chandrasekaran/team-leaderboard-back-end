import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const globalForPrisma = globalThis;

// Prisma Client configuration with connection pooling for Supabase
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production'){
   globalForPrisma.prisma = prisma;
}

// Connection function with retry logic
async function connectDatabase() {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      console.log("✅ Prisma connected to Supabase Postgres");
      return;
    } catch (err) {
      retries++;
      console.error(`❌ Prisma DB connection error (attempt ${retries}/${maxRetries}):`, err.message);
      
      if (retries >= maxRetries) {
        console.error("❌ Failed to connect to database after", maxRetries, "attempts");
        console.error("Please check:");
        console.error("1. DATABASE_URL is correctly set in .env file");
        console.error("2. Database server is running and accessible");
        console.error("3. Network connectivity to Supabase");
        console.error("4. Firewall settings allow connections to port 5432");
        throw err;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
}

// Connect on module load using top-level await
try {
  await connectDatabase();
} catch (err) {
  console.error('Fatal: Could not establish database connection:', err);
  // Don't exit in development to allow for manual fixes
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}