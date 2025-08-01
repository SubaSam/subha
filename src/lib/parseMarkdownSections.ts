// // utils/parseMarkdownSections.ts
// export function parseMarkdownSections(markdown: string) {
//   const lines = markdown.split('\n');
//   const sections = [];

//   let current = null;

//   for (let line of lines) {
//     const sectionHeader = line.match(/^##\s*\d+\.?\s*(.+)$/);
//     const bulletPoint = line.match(/^\*\s+(.*)$/);

//     if (sectionHeader) {
//       if (current) sections.push(current);
//       current = { title: sectionHeader[1].trim(), bullets: [] };
//     } else if (bulletPoint && current) {
//       current.bullets.push(bulletPoint[1].trim());
//     }
//   }

//   if (current) sections.push(current);
//   return sections;
// }
