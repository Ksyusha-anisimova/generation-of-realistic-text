import fs from "fs";
import path from "path";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
  Footer
} from "docx";

const outputPath = path.resolve("LR9N_Anisimova_AA.docx");

const lines = fs.readFileSync(path.resolve("docs/reports/LR9N_report_source.md"), "utf8").split("\n");

const children = [];
for (const rawLine of lines) {
  const line = rawLine.trimEnd();
  if (!line) {
    children.push(new Paragraph({ children: [new TextRun("")] }));
    continue;
  }

  if (line.startsWith("# ")) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: line.slice(2), bold: true })]
    }));
    continue;
  }

  if (line.startsWith("## ")) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: line.slice(3), bold: true })]
    }));
    continue;
  }

  if (line.startsWith("- ")) {
    children.push(new Paragraph({
      text: line,
      indent: { left: 360 }
    }));
    continue;
  }

  children.push(new Paragraph({ text: line }));
}

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: {
            width: 12240,
            height: 15840
          },
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440
          }
        }
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun("Страница "), PageNumber.CURRENT]
            })
          ]
        })
      },
      children
    }
  ]
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outputPath, buffer);
console.log(`DOCX generated: ${outputPath}`);
