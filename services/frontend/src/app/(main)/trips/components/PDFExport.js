import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Register Font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  serviceItem: {
    marginLeft: 20,
    marginBottom: 5,
  },
  meals: {
    marginTop: 10,
    fontStyle: 'italic',
  },
});

const PDFDocument = ({ brand, scheduleItems = [] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {brand?.logo ? (
          <Image style={styles.logo} src={brand.logo} />
        ) : (
          <Text>No logo available</Text>
        )}
        <Text style={styles.title}>{brand?.name || 'Trip Schedule'}</Text>
      </View>

      {scheduleItems.length > 0 ? (
        scheduleItems.map((day, index) => (
          <View key={index} style={styles.daySection}>
            <Text style={styles.dayTitle}>{day.title}</Text>
            {day.distance && <Text>Distance: {day.distance}km</Text>}

            {day.services.map((service, sIndex) => (
              <View key={sIndex} style={styles.serviceItem}>
                <Text>
                  {service.time}: {service.description || service.name}
                </Text>
              </View>
            ))}

            <Text style={styles.meals}>
              {Object.entries(day.meals)
                .filter(([, included]) => included)
                .map(([meal]) => meal)
                .join(' • ')}
            </Text>
          </View>
        ))
      ) : (
        <Text>No schedule items available</Text>
      )}
    </Page>
  </Document>
);

export default PDFDocument;
export const TripPDFDocument = PDFDocument;
