const notifyOwner = async ({ ownerPhone, itemName, finderMessage, scanLocation }) => {
  // Twilio WhatsApp (enable when credentials are set)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_sid') {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const message = `🏷️ *TagBack Alert!*\n\nYour item *"${itemName}"* was found!\n\n📍 Location: ${scanLocation || 'Unknown'}\n💬 Finder says: "${finderMessage}"\n\nOpen the TagBack app to chat with the finder and arrange return.\n\n_Reply STOP to unsubscribe_`;

      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:+91${ownerPhone}`,
        body: message
      });

      console.log(`WhatsApp notification sent to ${ownerPhone}`);
    } catch (err) {
      console.error('WhatsApp notification failed:', err.message);
    }
  } else {
    // Dev mode: just log
    console.log(`[DEV] Notification to ${ownerPhone}: "${itemName}" found. Message: "${finderMessage}"`);
  }
};

module.exports = { notifyOwner };
