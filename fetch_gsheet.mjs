import https from 'https';
import fs from 'fs';

const sheetUrl = 'https://docs.google.com/spreadsheets/d/1d6AuBPrhc6vHBdag9TODlIRD7dFhkjtLmb9zQduQxXU/export?format=csv&gid=0';

https.get(sheetUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('--- CSV Data ---');
    console.log(data.split('\n').slice(0, 10).join('\n'));
  });
}).on('error', (e) => {
  console.error(e);
});
