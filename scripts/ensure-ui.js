// scripts/ensure-ui.js
const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'components', 'ui');
const files = {
  'button.tsx': `import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className = "", ...props }, ref) => (
    <button ref={ref} className={"inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 "+className} {...props}/>
  )
);
Button.displayName = "Button";
export default Button;`,

  'card.tsx': `import * as React from "react";
export function Card(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={"rounded-xl border bg-white p-6 shadow-sm "+(p.className||"")} /> }
export function CardHeader(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={"mb-4 "+(p.className||"")} /> }
export function CardTitle(p: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 {...p} className={"text-xl font-semibold "+(p.className||"")} /> }
export function CardDescription(p: React.HTMLAttributes<HTMLParagraphElement>) { return <p {...p} className={"text-sm text-gray-600 "+(p.className||"")} /> }
export function CardContent(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={p.className||""} /> }
export function CardFooter(p: React.HTMLAttributes<HTMLDivElement>) { return <div {...p} className={"mt-4 "+(p.className||"")} /> }
export default Card;`,

  'input.tsx': `import * as React from "react";
type Props = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className="", ...props }, ref) => (
    <input ref={ref} className={"w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring "+className} {...props}/>
  )
);
Input.displayName = "Input";
export default Input;`,

  'label.tsx': `import * as React from "react";
type Props = React.LabelHTMLAttributes<HTMLLabelElement>;
export function Label({ className="", ...props }: Props) {
  return <label className={"mb-1 block text-sm font-medium "+className} {...props}/>;
}
export default Label;`,

  'alert.tsx': `import * as React from "react";
export function Alert({ className="", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={"rounded-md border border-red-300 bg-red-50 p-4 "+className} {...props}>{children}</div>;
}
export function AlertDescription({ className="", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={"text-sm text-red-700 "+className} {...props}/>;
}
export default Alert;`,

  'badge.tsx': `import * as React from "react";
type Props = React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "outline" | "success" | "warning" };
export function Badge({ className="", variant="default", ...props }: Props) {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 text-gray-700",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800"
  };
  return <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold "+(variantClasses[variant]||"")+" "+className} {...props}/>;
}
export default Badge;`,

  'select.tsx': `import * as React from "react";
type Props = React.SelectHTMLAttributes<HTMLSelectElement>;
export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ className="", children, ...props }, ref) => (
    <select ref={ref} className={"w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring "+className} {...props}>{children}</select>
  )
);
Select.displayName = "Select";
export default Select;`,

  'table.tsx': `import * as React from "react";
export function Table(p: React.HTMLAttributes<HTMLTableElement>) { return <table {...p} className={"w-full text-sm "+(p.className||"")} /> }
export function TableHeader(p: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...p} className={"bg-gray-50 "+(p.className||"")} /> }
export function TableBody(p: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...p} className={p.className||""} /> }
export function TableRow(p: React.HTMLAttributes<HTMLTableRowElement>) { return <tr {...p} className={"border-b hover:bg-gray-50 "+(p.className||"")} /> }
export function TableHead(p: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th {...p} className={"px-4 py-3 text-left font-medium "+(p.className||"")} /> }
export function TableCell(p: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td {...p} className={"px-4 py-3 "+(p.className||"")} /> }
export default Table;`,

  'textarea.tsx': `import * as React from "react";
type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ className="", ...props }, ref) => (
    <textarea ref={ref} className={"w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring "+className} {...props}/>
  )
);
Textarea.displayName = "Textarea";
export default Textarea;`
};

fs.mkdirSync(dir, { recursive: true });
console.log('=== Ensuring UI Components ===');
let created = 0, existing = 0;

for (const [name, src] of Object.entries(files)) {
  const filePath = path.join(dir, name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, src.trim(), 'utf8');
    console.log('✨ Created:', `components/ui/${name}`);
    created++;
  } else {
    console.log('✅ OK:', `components/ui/${name}`);
    existing++;
  }
}

console.log(`\n📊 Summary: ${existing} existing, ${created} created, ${existing + created} total`);
if (created > 0) console.log('⚠️  New files created - commit them after successful build!');

