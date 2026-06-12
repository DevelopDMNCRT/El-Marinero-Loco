const fs = require('fs');
let content = fs.readFileSync('client/src/App.vue', 'utf8');

// Replace space-y-6 on column wrappers with space-y-0
content = content.replace(/<div class="flex flex-col space-y-6">/g, '<div class="flex flex-col space-y-0">');

// Replace mt-10 on banners with mt-2 (so they don't look completely glued, or mt-0)
content = content.replace(/mt-10 group\/banner/g, 'mt-2 mb-2 group/banner');

fs.writeFileSync('client/src/App.vue', content);
console.log('Removed vertical spacing from column wrappers.');
