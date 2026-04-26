const QRCode = require('qrcode');

const generateQR = async (uniqueCode) => {
  const url = `${process.env.CLIENT_URL}/scan/${uniqueCode}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
      errorCorrectionLevel: 'H'
    });
    return { qrDataUrl, scanUrl: url };
  } catch (err) {
    throw new Error('QR generation failed');
  }
};

module.exports = { generateQR };
