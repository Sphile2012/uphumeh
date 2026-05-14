#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🐦 Twitter Clone Setup');
console.log('Cloned by Phumeh\n');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📝 Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created!');
  console.log('⚠️  Please update .env with your Supabase credentials\n');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists\n');
} else {
  console.log('❌ .env.example not found\n');
}

console.log('🚀 Next steps:');
console.log('1. Set up your Supabase project');
console.log('2. Run the SQL schema from supabase/schema.sql');
console.log('3. Update .env with your Supabase URL and anon key');
console.log('4. Run: npm install');
console.log('5. Run: npm run dev');
console.log('6. For deployment: npm run build\n');

console.log('📚 Check DEPLOYMENT.md for detailed instructions');
console.log('🎉 Happy coding!');