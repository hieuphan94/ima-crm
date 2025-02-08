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
  coverPage: {
    position: 'relative',
    padding: 0,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverTitleContainer: {
    position: 'absolute',
    top: '50%',
    left: 40,
    right: 40,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transform: 'translateY(-50%)',
  },
  coverTitle: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  contentPage: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logoHeader: {
    marginBottom: 20,
    justifyContent: 'center',
    width: '100%',
  },
  logoImage: {
    height: 'auto',
    maxWidth: '100%',
    objectFit: 'cover',
  },
  content: {
    flex: 1,
  },
  daySection: {
    marginBottom: 20,
    padding: 40,
  },
  dayTitleContainer: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
  },
  dayTitle: {
    fontSize: 18,
  },
  distanceText: {
    fontSize: 12,
    marginBottom: 8,
  },
  paragraph: {
    marginVertical: 8,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  normal: {
    fontFamily: 'Times-Roman',
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  italic: {
    fontFamily: 'Times-Italic',
  },
  defaultCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultCoverLogo: {
    maxWidth: '80%',
    height: 'auto',
    objectFit: 'contain',
  },
});

const PDFDocument = ({
  brand,
  scheduleItems = [],
  tripTitleColors = { text: '#000000', background: '#FFFFFF' },
  dayTitleColors = { text: '#000000', background: '#FFFFFF' },
  headerImage = null,
}) => {
  // Validate scheduleItems
  if (!Array.isArray(scheduleItems) || scheduleItems.length === 0) {
    scheduleItems = [
      {
        title: 'No schedule items',
        paragraphDay: { paragraphTotal: 'No content available' },
      },
    ];
  }

  return (
    <Document>
      {/* Cover page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {headerImage ? (
            <>
              <Image style={styles.coverImage} src={headerImage} />
              <View
                style={[
                  styles.coverTitleContainer,
                  { backgroundColor: tripTitleColors.background },
                ]}
              >
                <Text style={[styles.coverTitle, { color: tripTitleColors.text }]}>
                  {scheduleItems?.title || 'Trip Schedule'}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.defaultCover}>
                {brand?.logo && <Image style={styles.defaultCoverLogo} src={brand.logo} />}
              </View>
              <View
                style={[
                  styles.coverTitleContainer,
                  { backgroundColor: tripTitleColors.background },
                ]}
              >
                <Text style={[styles.coverTitle, { color: tripTitleColors.text }]}>
                  {scheduleItems?.title || 'Trip Schedule'}
                </Text>
              </View>
            </>
          )}
        </View>
      </Page>

      {/* Content page with fixed header */}
      <Page size="A4" style={styles.contentPage}>
        {/* Header cố định ở mỗi trang */}
        <View style={styles.logoHeader} fixed>
          {brand?.logo && <Image style={styles.logoImage} src={brand.logo} />}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title chỉ xuất hiện một lần ở đầu */}
          <Text style={[styles.dayTitle, { marginBottom: 20, textAlign: 'center' }]}>
            {scheduleItems?.title || 'Trip Schedule'}
          </Text>

          {/* Các ngày sẽ được render liên tục */}
          {scheduleItems.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.daySection}>
              <View
                style={[styles.dayTitleContainer, { backgroundColor: dayTitleColors.background }]}
              >
                <Text style={[styles.dayTitle, { color: dayTitleColors.text }]}>
                  {`Jour ${dayIndex + 1}: ${day.title}`}
                </Text>
              </View>
              {day.distance && <Text style={styles.distanceText}>Distance: {day.distance}km</Text>}
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
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
export const TripPDFDocument = PDFDocument;
