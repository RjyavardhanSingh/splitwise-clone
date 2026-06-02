import { google } from 'googleapis';
import { readFileSync } from 'fs';
import http from 'http';

const env = readFileSync('.env', 'utf-8');
const getEnv = (key) => {
  const m = env.match(new RegExp(`^${key}=(.+)`, 'm'));
  return m ? m[1].trim() : null;
};

const CLIENT_ID = getEnv('GOOGLE_CLIENT_ID');
const CLIENT_SECRET = getEnv('GOOGLE_CLIENT_SECRET');
const PORT = 3000;
const REDIRECT_URI = `http://127.0.0.1:${PORT}`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const SCOPES = ['https://mail.google.com/'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n=== Step 1: Enable Gmail API ===');
console.log('Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com');
console.log('Select your project → Click "Enable"\n');

console.log('=== Step 2: Add redirect URI ===');
console.log('Go to: https://console.cloud.google.com/apis/credentials');
console.log('Click your existing OAuth 2.0 Client ID');
console.log('Under "Authorized redirect URIs", add:');
console.log(`  ${REDIRECT_URI}`);
console.log('Click "Save"\n');

console.log('=== Step 3: Authorize ===');
console.log('Visit this URL in your browser (sign in as rajyyavardhans92@gmail.com):');
console.log('\n' + authUrl + '\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.end(`Error: ${error}. Close this tab and try again.`);
    server.close();
    process.exit(1);
  }

  if (code) {
    res.end('✅ Authorized! You can close this tab.');
    server.close();

    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n=== SUCCESS! Add to .env and Render: ===\n');
      console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    } catch (err) {
      console.error('\nError getting token:', err.response?.data || err.message);
    }
    process.exit(0);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Waiting for authorization callback on http://127.0.0.1:${PORT}...\n`);
});
