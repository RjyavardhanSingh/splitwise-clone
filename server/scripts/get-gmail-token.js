import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { createInterface } from 'readline';

const env = readFileSync('.env', 'utf-8');
const getEnv = (key) => {
  const m = env.match(new RegExp(`^${key}=(.+)`, 'm'));
  return m ? m[1].trim() : null;
};

const CLIENT_ID = getEnv('GOOGLE_CLIENT_ID');
const CLIENT_SECRET = getEnv('GOOGLE_CLIENT_SECRET');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

const SCOPES = ['https://mail.google.com/'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n=== Step 1: Enable Gmail API ===');
console.log('1. Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com');
console.log('2. Make sure your project is selected at the top');
console.log('3. Click "Enable"\n');

console.log('=== Step 2: Authorize ===');
console.log('Visit this URL in your browser:');
console.log('\n' + authUrl + '\n');
console.log('Sign in as', 'rajyyavardhans92@gmail.com');
console.log('Click "Continue" then "Allow"\n');

const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.question('Paste the code you got here: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log('\n=== SUCCESS! Add this to your .env and Render env vars: ===\n');
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  } catch (err) {
    console.error('\nError getting token:', err.response?.data || err.message);
  }
});
