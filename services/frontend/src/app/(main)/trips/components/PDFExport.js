import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Register Font - Noto Sans Vietnamese từ local
Font.register({
  family: 'NotoSansVietnamese',
  src: '/fonts/NotoSans-Regular.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'NotoSansVietnamese',
  src: '/fonts/NotoSans-Bold.ttf',
  fontWeight: 'bold',
});

// Sử dụng NotoSans SemiCondensed cho italic
Font.register({
  family: 'NotoSansVietnamese',
  src: '/fonts/NotoSans_SemiCondensed-ThinItalic.ttf', // Đổi tên file theo đúng font bạn có
  fontStyle: 'italic',
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
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-50%)',
  },
  coverTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'NotoSansVietnamese',
  },
  contentPage: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logoHeader: {
    marginBottom: 10,
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
    padding: 20,
  },
  daySection: {
    marginBottom: 10,
  },
  dayTitleContainer: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 2,
  },
  dayTitle: {
    fontSize: 14,
    fontFamily: 'NotoSansVietnamese',
    fontWeight: 'bold',
  },
  paragraph: {
    marginVertical: 8,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: 'NotoSansVietnamese',
  },
  normal: {
    fontFamily: 'NotoSansVietnamese',
    fontWeight: 'normal',
  },
  bold: {
    fontFamily: 'NotoSansVietnamese',
    fontWeight: 'bold',
  },
  italic: {
    fontFamily: 'NotoSansVietnamese',
    fontStyle: 'italic',
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
  tripInfoContainer: {
    marginBottom: 20,
  },
  tripTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NotoSansVietnamese',
    fontSize: 16,
    padding: 10,
    borderRadius: 2,
  },
  tripMetaInfo: {
    marginTop: 8,
    padding: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
  },
  metaInfoText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'NotoSansVietnamese',
    color: '#666666',
  },
});

const PDFDocument = ({
  brand,
  scheduleItems = [],
  scheduleInfo = {},
  settings = {},
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

  console.log('scheduleInfo', scheduleInfo);

  // Lấy thông tin từ scheduleInfo và settings
  const tripTitle = scheduleInfo?.title || 'Trip Schedule';
  const globalPax = settings?.globalPax || 1;
  const numberOfDays = settings?.numberOfDays || 1;
  const starRating = settings?.starRating || 4;

  console.log('PDF Export Data:', {
    tripTitle,
    globalPax,
    numberOfDays,
    starRating,
  });

  return (
    <Document>
      {/* Cover page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {headerImage ? (
            <>
              <Image style={styles.coverImage} src={headerImage} />
              <View style={[styles.coverTitleContainer]}>
                <Text style={[styles.coverTitle]}>{tripTitle}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.coverTitleContainer]}>
                <Text style={[styles.coverTitle]}>{tripTitle}</Text>
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
          {/* Title section with trip info */}
          <View style={styles.tripInfoContainer}>
            <Text
              style={[
                { backgroundColor: tripTitleColors.background },
                { color: tripTitleColors.text },
                styles.tripTitle,
              ]}
            >
              {tripTitle}
            </Text>

            <View style={styles.tripMetaInfo}>
              <Text style={styles.metaInfoText}>
                {`${numberOfDays} days`} • {`${globalPax} paxs`} • {`${starRating} *`}
              </Text>
            </View>
          </View>

          {/* Các ngày sẽ được render liên tục */}
          {scheduleItems.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.daySection}>
              <View
                style={[styles.dayTitleContainer, { backgroundColor: dayTitleColors.background }]}
              >
                <Text style={[styles.dayTitle, { color: dayTitleColors.text }]}>
                  {`Jour ${dayIndex + 1}: ${day.titleOfDay || ''} | Distance: ${day.distance}km`}
                </Text>
              </View>
              {day.paragraphDay.paragraphTotal && (
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
