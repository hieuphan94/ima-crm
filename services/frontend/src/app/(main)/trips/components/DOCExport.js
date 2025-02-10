import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

const convertHTMLToTextRuns = (htmlContent) => {
  if (!htmlContent) return [new TextRun({ text: '' })];

  // Xử lý các thẻ HTML cơ bản
  const parts = [];
  let currentText = htmlContent
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n');

  // Xử lý bold và italic
  const regex = /<(strong|b|em|i)>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(currentText)) !== null) {
    // Text thường trước thẻ định dạng
    if (match.index > lastIndex) {
      parts.push(
        new TextRun({
          text: currentText.substring(lastIndex, match.index),
        })
      );
    }

    // Text có định dạng
    parts.push(
      new TextRun({
        text: match[2],
        bold: match[1] === 'strong' || match[1] === 'b',
        italics: match[1] === 'em' || match[1] === 'i',
      })
    );

    lastIndex = regex.lastIndex;
  }

  // Text còn lại
  if (lastIndex < currentText.length) {
    parts.push(
      new TextRun({
        text: currentText.substring(lastIndex),
      })
    );
  }

  return parts;
};

const createDOCX = async ({ scheduleItems = [], scheduleInfo = {}, settings = {} }) => {
  console.log('createDOCX called with:', {
    scheduleItems: scheduleItems.length,
    scheduleInfo,
    settings,
  });

  const tripTitle = scheduleInfo?.title || 'Trip Schedule';
  const globalPax = settings?.globalPax || 1;
  const numberOfDays = settings?.numberOfDays || 1;
  const starRating = settings?.starRating || 4;

  // Header section với styling
  const headerSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: tripTitle,
          size: 32,
          bold: true,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${numberOfDays} ngày • ${globalPax} khách • ${starRating}★`,
          size: 24,
          color: '666666',
        }),
      ],
      spacing: { after: 400 },
    }),
  ];

  // Content từng ngày với xử lý HTML
  const daysContent = scheduleItems
    .map((day, index) => [
      new Paragraph({
        children: [
          new TextRun({
            text: `Jour ${index + 1}: ${day.titleOfDay || ''}`,
            bold: true,
            size: 28,
          }),
          new TextRun({
            text: ` | Distance: ${day.distance} km`,
            size: 24,
          }),
        ],
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: convertHTMLToTextRuns(day.paragraphDay?.paragraphTotal),
        spacing: { after: 200 },
      }),
    ])
    .flat();

  // Tạo document với styling
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [...headerSection, ...daysContent],
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            size: 24,
            font: 'Arial',
          },
          paragraph: {
            spacing: {
              line: 360,
            },
          },
        },
      ],
    },
  });

  return doc;
};

export const generateAndDownloadDOCX = async (data) => {
  try {
    console.log('generateAndDownloadDOCX called with:', {
      scheduleInfo: data.scheduleInfo,
      itemsCount: data.scheduleItems?.length,
    });

    const doc = await createDOCX(data);
    console.log('Document created, preparing blob...');

    const blob = await Packer.toBlob(doc);
    console.log('Blob created, preparing download...');

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.scheduleInfo?.title || 'trip'}-${Date.now()}.docx`;

    console.log('Triggering download...');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('Download process completed');
  } catch (error) {
    console.error('Error in generateAndDownloadDOCX:', error);
    throw error;
  }
};

export default createDOCX;
