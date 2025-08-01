// import React from 'react';

// type Props = {
//   responseText: string;
// };

// const ExtractedSections = ({ responseText }: Props) => {
//   type Section = {
//     title: string;
//     content: string[];
//   };

// const parseMarkdownSections = (markdown: string): Section[] => {
//   const lines = markdown.split('\n');
//   const sections: Section[] = [];
//   let current: Section | null = null;

//   for (let line of lines) {
//     const sectionHeader = line.match(/^##\s*\d+\.?\s*(.+)$/);
//     const bulletOrPara = line.match(/^[-*]\s+(.*)$/); // bullet or dash
//     const isNonEmpty = line.trim().length > 0;

//     if (sectionHeader) {
//       if (current) sections.push(current);
//       current = { title: sectionHeader[1].trim(), content: [] };
//     } else if (current && isNonEmpty) {
//       if (bulletOrPara) {
//         current.content.push(bulletOrPara[1].trim());
//       } else {
//         current.content.push(line.trim()); // plain paragraph
//       }
//     }
//   }

//   if (current) sections.push(current);
//   return sections;
// };



//  const sections = parseMarkdownSections(responseText);

// return (
//   <div className="space-y-4">
//     {sections.map((section, idx) => (
//       <div key={idx} className="p-4 rounded border  shadow-sm">
//         <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
//         <div className="space-y-2 ml-4">
//           {section.content.map((line, i) =>
//             line.startsWith('* ') || line.startsWith('- ') ? (
//               <ul key={i} className="list-disc ml-4">
//                 <li>{line.slice(2)}</li>
//               </ul>
//             ) : (
//               <p key={i} className="text-sm">{line}</p>
//             )
//           )}
//         </div>
//       </div>
//     ))}
//   </div>
// );

// };

// export default ExtractedSections;
import React from 'react';

interface Props {
  responseText: string;
}

const ExtractedSections: React.FC<Props> = ({ responseText }) => {
  if (!responseText) return null;

  // Split sections using ## headers
  const rawSections = responseText
    .split(/\n(?=## )/)
    .map((section) => section.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {rawSections.map((section, index) => {
        const lines = section.split('\n').map((line) => line.trim());
        const heading = lines[0].replace(/^##+\s*/, '').trim(); // remove ##

        const contentLines = lines
          .slice(1)
          .map((line) =>
            line
              .replace(/^\s*[-*#]+\s*/, '') // remove leading bullets + whitespace
              .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold markdown
              .replace(/\*(.*?)\*/g, '$1') // remove italic markdown
              .trim()
          )
          .filter((line) => line.length > 0);

        return (
          <div
            key={index}
            className="bg-[#1e1e1e] text-white p-4 rounded-lg shadow-md space-y-2 "
          >
            {/* <h3 className="text-md font-semibold">{`${index + 1}. ${heading}`}</h3> */}
            <div className="space-y-1 text-sm text-gray-300 ">
              {contentLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExtractedSections;
