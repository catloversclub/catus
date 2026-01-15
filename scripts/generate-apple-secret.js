
const { SignJWT } = require('jose');
const fs = require('fs');

/**
 * Usage: node scripts/generate-apple-secret.js <team_id> <client_id> <key_id> <private_key_path>
 */
async function generate() {
  const args = process.argv.slice(2);
  if (args.length < 4) {
    console.error('Usage: node scripts/generate-apple-secret.js <team_id> <client_id> <key_id> <private_key_path>');
    process.exit(1);
  }

  const [teamId, clientId, keyId, privateKeyPath] = args;
  
  if (!fs.existsSync(privateKeyPath)) {
    console.error(`Private key file not found: ${privateKeyPath}`);
    process.exit(1);
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const alg = 'ES256';

  // 15777000 seconds = 6 months (max allowed by Apple)
  const secret = await new SignJWT({})
    .setProtectedHeader({ alg, kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt()
    .setExpirationTime('180d') 
    .setAudience('https://appleid.apple.com')
    .setSubject(clientId)
    .sign(await import('jose').then(m => m.importPKCS8(privateKey, alg)));

  console.log('\n--- Apple Client Secret (Valid for 6 months) ---\n');
  console.log(secret);
  console.log('\n----------------------------------------------\n');
  console.log('Add this to your .env file as APPLE_CLIENT_SECRET');
}

generate().catch(console.error);
