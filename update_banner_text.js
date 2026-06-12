const fs = require('fs');
const file = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/client/src/App.vue';
let content = fs.readFileSync(file, 'utf8');

// The HTML contains:
// <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
// We will change it to include a subtitle or just append it.

// Let's replace the whole span block to make it look nicer with two lines:
// <div class="flex flex-col items-center">
//   <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
//   <span class="text-slate-400 text-xs mt-1">(Recomendado: 800x200 px)</span>
// </div>

const targetStr = '<span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>';
const newStr = `<div class="flex flex-col items-center">
                  <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
                  <span class="text-slate-400 text-xs mt-1 font-medium">(Recomendado: 800x200 px)</span>
                </div>`;

content = content.replace(new RegExp(targetStr, 'g'), newStr);

fs.writeFileSync(file, content);
console.log("Updated banner text.");
