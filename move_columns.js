const fs = require('fs');
let content = fs.readFileSync('client/src/App.vue', 'utf8');

// 1. Move Torres, Camarones, Caldos to Entradas column
const col1Dest = '          <!-- Column 2: Cocteles & Especialidades -->';
const col1DestIdx = content.indexOf(col1Dest);

// The end of Column 1 is just the </div> before col1DestIdx.
const col1InsertIdx = content.lastIndexOf('</div>', col1DestIdx - 1);

// Get the contents to move
const col1SrcStartStr = '            <!-- torres -->';
const col1SrcStartIdx = content.indexOf(col1SrcStartStr);
const col1SrcEndStr = '          <!-- Col 2 -->';
const col1SrcEndIdx = content.lastIndexOf('</div>', content.indexOf(col1SrcEndStr) - 1);
const col1MoveContent = content.slice(col1SrcStartIdx, col1SrcEndIdx);

// 2. Move Filetes, Tostadas, Cortes, Marineritos to Cocteles column
const col2DestStr = '        <!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->';
const col2DestIdx = content.indexOf(col2DestStr);

// The end of Column 2 is just the </div> before the grid closing </div> before SEGUNDA PARTE.
const col2InsertIdx = content.lastIndexOf('</div>', content.lastIndexOf('</div>', col2DestIdx - 1) - 1);

// Get the contents to move
const col2SrcStartStr = '            <!-- filetes -->';
const col2SrcStartIdx = content.indexOf(col2SrcStartStr);
const col2SrcEndStr = '        <!-- ===== SECCION BEBIDAS ===== -->';
const col2SrcEndIdx = content.lastIndexOf('</div>', content.lastIndexOf('</div>', content.indexOf(col2SrcEndStr) - 1) - 1);
const col2MoveContent = content.slice(col2SrcStartIdx, col2SrcEndIdx);

// 3. Remove the entire SEGUNDA PARTE block
const blockStartIdx = content.indexOf('        <!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->');
const blockEndIdx = content.indexOf('        <!-- ===== SECCION BEBIDAS ===== -->');

// Reconstruct file
let newContent = content.slice(0, col1InsertIdx) + 
                 col1MoveContent + 
                 content.slice(col1InsertIdx, col2InsertIdx) + 
                 col2MoveContent + 
                 content.slice(col2InsertIdx, blockStartIdx) + 
                 content.slice(blockEndIdx);

fs.writeFileSync('client/src/App.vue', newContent);
console.log('Moved columns successfully.');
