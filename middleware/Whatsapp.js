import twilio from 'twilio'

const accountSid = 'AC4d24baf71f6d8e0e0c8368ffb85ee773';
const authToken = 'f3f2e7ee90bf61ea038ebbf55b5fa8fb';
const client = twilio(accountSid, authToken);


export const sendWhatsAppMessage = async (query) => {
    try {
      // The phone number of the user in international format (e.g., +1XXXXXXXXXX for US numbers)
      const userPhoneNumber = `+91${query.phone}`;
  
      // Customize your WhatsApp message here
      const message = `Dear ${query.name},\nThank you for your query. We will get back to you as soon as possible.`;
  
      // Use the Twilio API to send the WhatsApp message
      await client.messages.create({
        body: message,
        from: '+15735203076', // Replace with your Twilio WhatsApp sandbox number
        to: userPhoneNumber,
      });
  
      console.log('WhatsApp message sent to user', userPhoneNumber);
    } catch (error) {
      console.error('Error sending WhatsApp message to user:', error);
    }
  };
  