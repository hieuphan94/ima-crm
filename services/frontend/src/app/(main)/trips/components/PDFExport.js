import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Register Font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 'medium',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
});

// Hoặc sử dụng font mặc định an toàn hơn
Font.register({
  family: 'Helvetica',
  fonts: [
    {
      src: 'https://fonts.cdnfonts.com/s/29136/Helvetica.woff',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.cdnfonts.com/s/29136/Helvetica-Bold.woff',
      fontWeight: 'bold',
    },
  ],
});

const formatHTMLToPDF = (htmlContent) => {
  console.log('Original HTML:', htmlContent);
  if (!htmlContent) return [];

  let currentText = htmlContent;

  // 1. Xử lý thẻ p - thêm xuống dòng sau mỗi thẻ p
  currentText = currentText.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // 2. Xử lý <br>
  currentText = currentText.replace(/<br\s*\/?>/gi, '\n');

  // 3. Tách text thành mảng dựa trên <strong>, <b>, và <em>
  const parts = [];
  // Regex mới bao gồm cả <em>
  const formatRegex = /<(strong|b|em)>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match;

  while ((match = formatRegex.exec(currentText)) !== null) {
    console.log('Processing format match:', match[1], match[2]);

    // Thêm text thường trước thẻ định dạng
    if (match.index > lastIndex) {
      const normalText = currentText
        .substring(lastIndex, match.index)
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      if (normalText.trim()) {
        parts.push({
          type: 'normal',
          content: normalText,
        });
      }
    }

    // Thêm phần text có định dạng
    const formattedText = match[2]
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    if (formattedText.trim()) {
      parts.push({
        type: match[1] === 'em' ? 'italic' : 'bold', // Phân biệt giữa em và strong/b
        content: formattedText,
      });
    }

    lastIndex = formatRegex.lastIndex;
  }

  // Thêm phần text còn lại
  if (lastIndex < currentText.length) {
    const remainingText = currentText
      .substring(lastIndex)
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    if (remainingText.trim()) {
      parts.push({
        type: 'normal',
        content: remainingText,
      });
    }
  }

  return parts;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: 100,
    objectFit: 'contain',
  },
  content: {
    padding: 40,
    paddingTop: 20,
    flexGrow: 1,
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#927B35',
    color: 'white',
    padding: 8,
  },
  daySection: {
    breakInside: 'avoid',
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#FFB800',
    padding: 8,
    color: 'black',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
    breakInside: 'avoid',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  timeCell: {
    width: '20%',
  },
  descriptionCell: {
    width: '80%',
  },
  paragraph: {
    marginVertical: 8,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: 'Times-Roman',
  },
  normal: {
    fontFamily: 'Times-Roman',
  },
  bold: {
    fontFamily: 'Times-Bold',
    fontWeight: 'bold',
  },
  italic: {
    fontFamily: 'Times-Italic',
    fontStyle: 'italic',
  },
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  textJustify: {
    textAlign: 'justify',
  },
});

const PDFDocument = ({ brand, scheduleItems = [] }) => {
  return (
    <Document>
      {scheduleItems.map((day, index) => (
        <Page key={index} size="A4" style={styles.page} wrap={false}>
          {/* Header luôn xuất hiện ở đầu mỗi trang */}
          <View style={styles.header} fixed>
            {brand?.logo && <Image style={styles.headerImage} src={brand.logo} />}
            {/* Chỉ hiển thị title ở trang đầu tiên */}
            {index === 0 && (
              <Text style={styles.title}>{scheduleItems?.title || 'Trip Schedule'}</Text>
            )}
          </View>

          {/* Content của ngày */}
          <View style={styles.content} break>
            <View style={styles.daySection}>
              <Text style={styles.dayTitle}>{`Jour ${index + 1}: ${day.title}`}</Text>
              {day.distance && <Text>Distance: {day.distance}km</Text>}

              {day.paragraphDay?.paragraphTotal && (
                <View style={styles.paragraph}>
                  <Text style={styles.text}>
                    {formatHTMLToPDF(day.paragraphDay.paragraphTotal).map((part, idx) => (
                      <Text
                        key={idx}
                        style={[
                          styles.normal,
                          part.type === 'bold' && styles.bold,
                          part.type === 'italic' && styles.italic,
                        ].filter(Boolean)}
                      >
                        {part.content}
                      </Text>
                    ))}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PDFDocument;
export const TripPDFDocument = PDFDocument;
