const fs = require('fs');

const file = 'client/src/App.vue';
let content = fs.readFileSync(file, 'utf8');

// 1. Identify where to insert: end of Column 1
const col2StartStr = '          <!-- Column 2: Cocteles & Especialidades -->';
const col2StartIdx = content.indexOf(col2StartStr);
// The insertion point is right before the </div> that closes Column 1
const insertIdx = content.lastIndexOf('</div>', col2StartIdx - 1);

// 2. Identify what to extract: Marineritos + Banner 5 from Column 2
const startStr = '            <!-- marineritos -->';
const startIdx = content.indexOf(startStr);

// It ends right before the closing </div> of Column 2.
// Column 2 closes just before SECCION BEBIDAS.
const endBlockStr = '        <!-- ===== SECCION BEBIDAS ===== -->';
const endBlockIdx = content.indexOf(endBlockStr);
// There are two closing divs before SECCION BEBIDAS: one for Col 2, one for the Grid.
const col2CloseIdx = content.lastIndexOf('</div>', content.lastIndexOf('</div>', endBlockIdx - 1) - 1);

// Wait, the content from startIdx to col2CloseIdx IS exactly the Marineritos block and Banner 5!
const contentToMove = content.slice(startIdx, col2CloseIdx);

// 3. Remove it from Column 2 and insert it into Column 1
let newContent = content.slice(0, insertIdx) + 
                 contentToMove + 
                 content.slice(insertIdx, startIdx) + 
                 content.slice(col2CloseIdx);

fs.writeFileSync(file, newContent);
console.log('Marineritos and Banner 5 moved to Column 1.');

