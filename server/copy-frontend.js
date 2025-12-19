// Script to copy frontend build to server/dist/public
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontendDistPath = join(__dirname, '..', 'dist');
const serverPublicPath = join(__dirname, 'dist', 'public');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  try {
    console.log('📦 Copying frontend build to server/dist/public...');
    
    // Check if frontend dist exists
    try {
      await fs.access(frontendDistPath);
    } catch {
      console.error('❌ Frontend dist folder not found!');
      console.error('Please run "npm run build" in the root directory first.');
      process.exit(1);
    }

    // Create server dist folder if it doesn't exist
    await fs.mkdir(dirname(serverPublicPath), { recursive: true });

    // Copy frontend to server/dist/public
    await copyDir(frontendDistPath, serverPublicPath);

    console.log('✅ Frontend copied successfully!');
  } catch (error) {
    console.error('❌ Error copying frontend:', error);
    process.exit(1);
  }
}

main();
