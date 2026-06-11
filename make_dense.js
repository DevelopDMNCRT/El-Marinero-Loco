const fs = require('fs');
const file = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/client/src/App.vue';
let content = fs.readFileSync(file, 'utf8');

// 1. Reduce category gap inside columns (space-y-12 -> space-y-6)
content = content.replace(/space-y-12/g, 'space-y-6');

// 2. Reduce grid gaps (gap-y-12, gap-y-16 -> gap-y-6)
content = content.replace(/gap-y-12/g, 'gap-y-6');
content = content.replace(/gap-y-16/g, 'gap-y-8');
content = content.replace(/mt-16/g, 'mt-8');

// 3. Reduce header margins inside categories (mb-6 -> mb-2)
content = content.replace(/mb-6 justify-center/g, 'mb-2 justify-center');

// 4. Reduce item list spacing (space-y-2 -> space-y-0)
content = content.replace(/ul class="space-y-2"/g, 'ul class="space-y-0"');

// 5. Postres spacing
content = content.replace(/space-y-3/g, 'space-y-1');
content = content.replace(/mb-8 justify-center/g, 'mb-4 justify-center');

// Write back
fs.writeFileSync(file, content);
console.log("Menu made dense.");
