const fs = require('fs');

const paths = [
  'components/ui/card.tsx',
  'components/ui/button.tsx',
  'components/ui/input.tsx',
  'components/ui/label.tsx',
  'components/ui/alert.tsx',
  'components/ui/badge.tsx',
  'components/ui/select.tsx',
  'components/ui/table.tsx',
  'components/ui/textarea.tsx'
];

console.log('=== UI Components Check ===');
let allOk = true;
for (const p of paths) {
  const exists = fs.existsSync(p);
  console.log(p, exists ? '✅ OK' : '❌ MISSING');
  if (!exists) allOk = false;
}
console.log(allOk ? '\n✅ All UI components present!' : '\n❌ Some UI components missing!');

