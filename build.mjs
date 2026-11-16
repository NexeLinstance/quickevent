// build.mjs
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

try {
  console.log('📦 Starting build...');

  // 1. Build the minified JS
  run('npm run build');

  // 2. Download DOMPurify
  console.log('⬇️ Downloading DOMPurify...');
  const libDir = path.join(process.cwd(), 'dist', 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  run(`curl -fL -o ${path.join(libDir, 'purify.min.js')} "https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"`);

  // 3. Copy Markers CSS
  console.log('🎨 Copying Markers CSS...');
  fs.copyFileSync(
    path.join(process.cwd(), 'src', 'assets', 'quickevent-markers.css'),
    path.join(process.cwd(), 'dist', 'quickevent-markers.css')
  );

  console.log('\n✅ Build complete! Files are in /dist');
  console.log('   - dist/quickevent.min.js');
  console.log('   - dist/lib/purify.min.js');
  console.log('   - dist/quickevent-markers.css');

} catch (error) {
  console.error('\n❌ Build failed:');
  console.error(error.message);
  process.exit(1);
}