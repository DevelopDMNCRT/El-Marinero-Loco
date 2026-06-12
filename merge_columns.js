const fs = require('fs');

const file = 'client/src/App.vue';
let content = fs.readFileSync(file, 'utf8');

// The goal is to move:
// <!-- torres --> ... <!-- Banner banner4 --> </div>
// Into Column 1 of the first part.
// But we need to identify the exact boundaries.

// Let's find where Column 1 of the first part ends.
// It ends with:
//               </div>
//             </div>
//           </div>
//
//           <!-- Column 2: Cocteles & Especialidades -->
const col2StartStr = '          <!-- Column 2: Cocteles & Especialidades -->';
const col1EndIdx = content.indexOf(col2StartStr);

// We want to insert the contents of Segunda Parte Col 1 right before the closing </div> of Column 1.
// Column 1 is just `<div>` after `<!-- Column 1: Entradas -->`.
// Let's find the `</div>` that closes Column 1.
const lastDivBeforeCol2 = content.lastIndexOf('</div>', col1EndIdx - 1);

// Now let's extract the contents of Segunda Parte Col 1.
const segundaCol1StartStr = '          <!-- Col 1 -->\n          <div class="flex flex-col space-y-0">\n            \n            <!-- torres -->';
const segundaCol1StartIdx = content.indexOf('            <!-- torres -->');

// It ends before `<!-- Col 2 -->`
const segundaCol2StartStr = '          <!-- Col 2 -->';
const segundaCol2StartIdx = content.indexOf(segundaCol2StartStr);

// The contents of Segunda Parte Col 1 (excluding the wrapper `<div class="flex flex-col space-y-0">` and its closing `</div>`)
// We can just take everything from `<!-- torres -->` up to the closing `</div>` before `<!-- Col 2 -->`
const endOfCol1Contents = content.lastIndexOf('</div>', segundaCol2StartIdx - 1);
const col1ContentsToMove = content.slice(segundaCol1StartIdx, endOfCol1Contents);

// Now for Segunda Parte Col 2.
const segundaCol2ContentsStartIdx = content.indexOf('            <!-- filetes -->');
const seccionBebidasStr = '        <!-- ===== SECCION BEBIDAS ===== -->';
const seccionBebidasIdx = content.indexOf(seccionBebidasStr);

// We need to find the closing tags of Segunda Parte Col 2.
// It's wrapped in `<div class="flex flex-col space-y-0">`.
const endOfCol2Contents = content.lastIndexOf('</div>', content.lastIndexOf('</div>', seccionBebidasIdx - 1) - 1);
const col2ContentsToMove = content.slice(segundaCol2ContentsStartIdx, endOfCol2Contents);

// Now we need to append `col1ContentsToMove` to First Part Column 1.
// And `col2ContentsToMove` to First Part Column 2.

// Where does First Part Column 2 end?
const segundaParteStr = '        <!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->';
const segundaParteIdx = content.indexOf(segundaParteStr);
// The closing tags of First Part Column 2:
const endOfFirstPartCol2Contents = content.lastIndexOf('</div>', content.lastIndexOf('</div>', segundaParteIdx - 1) - 1);

// Now we construct the new file.
// We remove the entire `<!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->` grid block.
// The grid block starts at `segundaParteIdx` and ends at `seccionBebidasIdx`.
// Actually, `seccionBebidasIdx` includes the closing `</div>` of the second grid.
const endOfSecondGrid = content.lastIndexOf('</div>', seccionBebidasIdx - 1);

// Let's do this safer by just writing a quick script to output the line numbers to be sure.
console.log('col1EndIdx', col1EndIdx);
console.log('segundaCol1StartIdx', segundaCol1StartIdx);
console.log('segundaCol2StartIdx', segundaCol2StartIdx);
console.log('segundaCol2ContentsStartIdx', segundaCol2ContentsStartIdx);
console.log('seccionBebidasIdx', seccionBebidasIdx);

