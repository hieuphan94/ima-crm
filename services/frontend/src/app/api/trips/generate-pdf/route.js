import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  try {
    const { brand, scheduleItems } = await request.json();

    // Khởi tạo browser
    const browser = await puppeteer.launch({
      headless: 'new',
    });

    // Tạo trang mới
    const page = await browser.newPage();

    // Tạo HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${brand.name} - Trip Schedule</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              max-width: 200px;
              margin-bottom: 20px;
            }
            .day-section {
              margin-bottom: 30px;
            }
            .day-title {
              font-size: 24px;
              color: #333;
              margin-bottom: 15px;
            }
            .service-item {
              margin-bottom: 10px;
              padding-left: 20px;
            }
            .meals {
              margin-top: 10px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${brand.logo}" alt="${brand.name}" class="logo">
            <h1>${brand.name} - Trip Schedule</h1>
          </div>
          
          ${scheduleItems
            .map(
              (day) => `
            <div class="day-section">
              <h2 class="day-title">${day.title}</h2>
              ${day.distance ? `<p>Distance: ${day.distance}km</p>` : ''}
              
              ${day.services
                .map(
                  (service) => `
                <div class="service-item">
                  <strong>${service.time}:</strong> ${service.description || service.name}
                </div>
              `
                )
                .join('')}
              
              <div class="meals">
                ${Object.entries(day.meals)
                  .map(([meal, included]) => (included ? `<span>${meal} </span>` : ''))
                  .join(' • ')}
              </div>
            </div>
          `
            )
            .join('')}
        </body>
      </html>
    `;

    // Set content cho page
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

    // Tạo PDF
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      printBackground: true,
    });

    // Đóng browser
    await browser.close();

    // Trả về PDF file
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="trip-${brand.id}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
