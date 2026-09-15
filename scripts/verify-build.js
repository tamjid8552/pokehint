const fs = require('fs');

const required = ['index.html', 'styles.css', 'app.js'];
for (const file of required) {
  if (!fs.existsSync(file)) {
    throw new Error(`${file} is missing`);
  }
}
console.log('MythiX website files ready');
