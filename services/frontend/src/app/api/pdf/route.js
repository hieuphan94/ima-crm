import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import puppeteer from 'puppeteer';

// Thêm CORS middleware
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    // Thêm CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/pdf',
    };

    console.log('Starting PDF generation...');
    const data = await request.json();

    console.log('Received data:', {
      brandId: data.brand?.id,
      brandName: data.brand?.name,
      brandLogo: data.brand?.logo,
      itemsCount: data.scheduleItems?.length,
    });

    // Launch browser với additional args
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });
    const page = await browser.newPage();

    // Generate HTML content
    console.log('Generating HTML content...');
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              max-width: 200px;
              max-height: 80px;
              margin-bottom: 15px;
            }
            .generation-info {
              color: #6b7280;
              font-size: 12px;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .day-title {
              font-size: 20px;
              font-weight: 500;
              margin-top: 30px;
            }
            .info {
              margin: 10px 0;
              font-size: 14px;
            }
            .service {
              margin: 15px 0;
              padding: 10px;
              background: #f9fafb;
              border-radius: 5px;
            }
            .paragraph {
              margin: 15px 0;
              line-height: 1.6;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .footer-logo {
              max-width: 150px;
              max-height: 60px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              data.brand?.logo
                ? `
              <img 
                src="${data.brand.logo}"
                class="logo"
                alt="${data.brand.name}"
              />
            `
                : ''
            }
            <div class="generation-info">
              Generated at: ${new Date().toLocaleString()}
            </div>
          </div>

          <div class="title">Schedule Items</div>

          ${
            data.scheduleItems?.length > 0
              ? data.scheduleItems
                  .map(
                    (item, index) => `
            <div>
              <div class="day-title">${item.title || `Day ${index + 1}`}</div>
              
              <div class="info">Distance: ${item.distance || 0}km</div>
              
              ${
                item.meals
                  ? `
                <div class="info">
                  Meals: Breakfast: ${item.meals.breakfast ? '✓' : '✗'} | 
                  Lunch: ${item.meals.lunch ? '✓' : '✗'} | 
                  Dinner: ${item.meals.dinner ? '✓' : '✗'}
                </div>
              `
                  : ''
              }

              ${
                item.services?.length > 0
                  ? item.services
                      .map(
                        (service) => `
                <div class="service">
                  <div>Time: ${service.time || 'N/A'}</div>
                  <div>Service: ${service.name || 'N/A'}</div>
                  <div>Description: ${service.description || 'N/A'}</div>
                </div>
              `
                      )
                      .join('')
                  : ''
              }

              ${
                item.paragraphDay?.paragraphTotal
                  ? `
                <div class="paragraph">
                  ${item.paragraphDay.paragraphTotal.replace(/<\/?[^>]+(>|$)/g, '')}
                </div>
              `
                  : ''
              }
            </div>
          `
                  )
                  .join('')
              : '<div>No schedule items available</div>'
          }

          <div class="footer">
            ${
              data.brand?.logo
                ? `
              <img 
                src="data:image/png;base64,${await getBase64Image(data.brand.logo)}" 
                class="footer-logo"
                alt="${data.brand.name}"
              />
            `
                : ''
            }
          </div>
        </body>
      </html>
    `;

    console.log('Setting page content...');
    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });

    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground: true,
      preferCSSPageSize: true,
    });

    console.log('PDF generated, size:', pdfBuffer.length);

    // Close browser
    await browser.close();
    console.log('Browser closed');

    return new NextResponse(pdfBuffer, {
      headers: {
        ...headers,
        'Content-Disposition': `attachment; filename=trip-${data.brand?.id || 'export'}-${Date.now()}.pdf`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Helper function to get base64 image
async function getBase64Image(imagePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));
    const imageBuffer = await fs.readFile(fullPath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error reading image:', error);
    return '';
  }
}
