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
  src: '/fonts/NotoSans_SemiCondensed-ThinItalic.ttf',
  fontStyle: 'italic',
});

const formatHTMLToPDF = (htmlContent) => {
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
  footerPage: {
    position: 'relative',
    padding: 0,
  },
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
    bottom: 50,
    right: 50,
  },
  coverTitle: {
    fontSize: 25,
    textTransform: 'uppercase',
    color: 'white',
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
    padding: 3,
  },
  dayTitle: {
    fontSize: 14,
    fontFamily: 'NotoSansVietnamese',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    marginVertical: 8,
    padding: 3,
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
  tripInfoContainer: {},
  tripTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'NotoSansVietnamese',
    fontSize: 16,
    padding: 3,
    textTransform: 'uppercase',
  },
});

const formatMeal = (day) => {
  let mealString = '';
  if (day.meals.breakfast.included === true) {
    mealString += 'Pdj';
  }
  if (day.meals.lunch.included === true) {
    mealString += '- Dej';
  }
  if (day.meals.dinner.included === true) {
    mealString += '- Din |';
  }
  return mealString;
};

const formatGuide = (day) => {
  let guideString = '';
  if (day.guides && day.guides.included === true) {
    guideString += ' Avec Guide | ';
  }
  return guideString;
};

const formatHotel = (day) => {
  let hotelString = '';
  if (day.hotels && day.hotels.included === true) {
    hotelString += ' Avec Hotel |';
  }
  return hotelString;
};

const PDFDocument = ({
  brand,
  scheduleItems = [],
  scheduleInfo = {},
  settings = {},
  tripTitleColors = { text: '#000000', background: '#FFFFFF' },
  dayTitleColors = { text: '#000000', background: '#FFFFFF' },
  headerImage = null,
  footerImage = null,
}) => {
  console.log('PDFDocument received props:', {
    brandId: brand?.id,
    hasHeaderImage: !!headerImage,
    hasFooterImage: !!footerImage,
    footerImageType: footerImage ? typeof footerImage : 'null',
  });

  // Validate scheduleItems
  if (!Array.isArray(scheduleItems) || scheduleItems.length === 0) {
    console.warn('No schedule items provided');
    scheduleItems = [
      {
        title: 'No schedule items',
        paragraphDay: { paragraphTotal: 'No content available' },
      },
    ];
  }

  // Ensure footerImage is a valid URL or base64 string
  const validFooterImage =
    footerImage && (footerImage.startsWith('data:image') || footerImage.startsWith('http'));
  console.log('Footer image validation:', {
    footerImage: footerImage ? 'exists' : 'null',
    isValid: validFooterImage,
    startsWith: footerImage ? footerImage.substring(0, 20) + '...' : 'null',
  });

  // Lấy thông tin từ scheduleInfo và settings
  const tripTitle = scheduleInfo?.title || 'Trip Schedule';

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
              Programme : {tripTitle}
            </Text>
          </View>

          {/* Các ngày sẽ được render liên tục */}
          {scheduleItems.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.daySection}>
              <View
                style={[styles.dayTitleContainer, { backgroundColor: dayTitleColors.background }]}
              >
                <Text style={[styles.dayTitle, { color: dayTitleColors.text }]}>
                  {`Jour ${dayIndex + 1}: ${day.titleOfDay || ''}`}
                </Text>
              </View>
              <View style={{ backgroundColor: '#FFDAB9', fontSize: 11, padding: 3 }}>
                <Text>
                  Repas: {`${formatMeal(day)}`} | Guide: {`${formatGuide(day)}`} | Hotel:{' '}
                  {`${formatHotel(day)}`}
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
      <Page size="A4" style={styles.footerPage}>
        <View style={{ position: 'relative', width: '100%', height: '100%' }}>
          {validFooterImage ? (
            <Image
              style={styles.coverImage}
              src={footerImage}
              onError={(error) => console.error('Footer image rendering error:', error)}
            />
          ) : (
            <View style={[styles.coverTitleContainer]}>
              <Text style={[styles.coverTitle]}>{tripTitle}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
export const TripPDFDocument = PDFDocument;
