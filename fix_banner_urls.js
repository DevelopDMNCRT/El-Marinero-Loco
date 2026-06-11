const fs = require('fs');
const file = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/client/src/App.vue';
let content = fs.readFileSync(file, 'utf8');

// The pattern is: :src="API + banners.banner1"
// We want to replace it with: :src="banners.banner1.startsWith('http') ? banners.banner1 : API + banners.banner1"

content = content.replace(/:src="API \+ banners\.([^"]+)"/g, ':src="banners.$1.startsWith(\'http\') ? banners.$1 : API + banners.$1"');

fs.writeFileSync(file, content);
console.log("Banner URLs fixed.");
