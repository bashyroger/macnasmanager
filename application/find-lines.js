const fs = require('fs');
const path = require('path');
const file = fs.readFileSync(path.join(__dirname, 'lib/supabase/database.types.ts'), 'utf8');
const lines = file.split('\n');
lines.forEach((l, i) => {
  if (l.includes('sync_runs') || l.includes('google_event_id')) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
