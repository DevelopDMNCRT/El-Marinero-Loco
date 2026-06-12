const fs = require('fs');
const file = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/client/src/App.vue';
let content = fs.readFileSync(file, 'utf8');

// Change the masonry wrapper for Alimentos to lg:columns-3
content = content.replace(/<div class="menu-masonry-wrapper columns-1 lg:columns-2 gap-x-16 w-full">/g, '<div class="menu-masonry-wrapper columns-1 md:columns-2 lg:columns-3 gap-x-16 w-full">');

// Also update the grids inside just in case (though they are display: contents on desktop)
content = content.replace(/<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">/g, '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">');
content = content.replace(/<div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mt-8">/g, '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6 mt-8">');

fs.writeFileSync(file, content);
console.log("Updated to 3 columns.");
