const fs = require('fs');

const content = fs.readFileSync('client/src/App.vue', 'utf8');

function processSection(text, startKeyword, numCols) {
  let modified = text;
  
  // 1. Find the grid container and replace it with columns
  // The first grid container after the keyword
  const keywordIndex = modified.indexOf(startKeyword);
  if (keywordIndex === -1) return modified;
  
  const gridRegex = /<div class="grid [^>]+>/;
  const match = gridRegex.exec(modified.slice(keywordIndex));
  if (!match) return modified;
  
  const gridMatchStr = match[0];
  const gridStart = keywordIndex + match.index;
  const gridEnd = gridStart + gridMatchStr.length;
  
  // Replace grid with columns
  let newGridStr = gridMatchStr.replace('grid ', '');
  newGridStr = newGridStr.replace(/grid-cols-(\d)/g, 'columns-$1');
  // ensure space-y is added to the container so gaps work, or maybe gap-y doesn't work for columns?
  // wait, columns uses gap-x for horizontal space. For vertical space between elements, we use mb-X on children!
  // So we just replace grid with columns and grid-cols with columns.
  
  modified = modified.slice(0, gridStart) + newGridStr + modified.slice(gridEnd);
  
  // 2. Now we need to remove the wrapper columns.
  // There are `numCols` wrappers. For example, `<!-- Col 1 -->\n <div class="flex flex-col ...">`
  // Let's find all wrappers inside this grid.
  
  // We'll iterate to find `<div class="flex flex-col` inside this grid.
  let searchPos = gridStart + newGridStr.length;
  
  for (let i = 0; i < numCols; i++) {
    const wrapperMatch = /<div class="flex flex-col[^>]+>/.exec(modified.slice(searchPos));
    if (!wrapperMatch) {
      // For the first grid, the wrapper is just `<div>` after `<!-- Column 1: Entradas -->`
      // This is getting complicated. Let's do it manually via bracket matching for specific indices.
      break;
    }
    
    const wrapperStart = searchPos + wrapperMatch.index;
    const wrapperEnd = wrapperStart + wrapperMatch[0].length;
    
    // Find matching closing div
    let depth = 1;
    let curr = wrapperEnd;
    while (depth > 0 && curr < modified.length) {
      const nextOpen = modified.indexOf('<div', curr);
      const nextClose = modified.indexOf('</div', curr);
      
      if (nextClose === -1) break; // Should never happen
      
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        curr = nextOpen + 4;
      } else {
        depth--;
        curr = nextClose + 6; // '</div>'.length
      }
    }
    
    if (depth === 0) {
      const closeEnd = curr;
      const closeStart = closeEnd - 6;
      
      // Remove wrapper
      // We must remove the closing tag FIRST so indices don't shift for the start tag
      modified = modified.slice(0, closeStart) + modified.slice(closeEnd);
      modified = modified.slice(0, wrapperStart) + modified.slice(wrapperEnd);
      
      // Update searchPos
      searchPos = wrapperEnd; // It shifted, but roughly here
    }
  }
  
  return modified;
}

// Instead of complex parsing, I will just manually replace the exact strings because I know the file exactly.
// I will output the file line by line so I can see exactly what lines to delete!
