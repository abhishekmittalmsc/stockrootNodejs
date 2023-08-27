import nodemailer from 'nodemailer';
import mammoth from 'mammoth';

// ...

export const sendEmailToAdmin = async (query) => {
  try {
    const adminEmail = 'stockrootscare@gmail.com'; // Replace with your admin's email address

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stockrootscare@gmail.com',
        pass: 'mlniwtrbisrfzboh',
      },
    });

    // Setup email data with custom format for admin
    const adminMailOptions = {
      from: 'stockrootscare@gmail.com',
      to: adminEmail,
      subject: 'New Query Received',
      text: `New query received from ${query.name}\nEmail: ${query.email}\nPhone: ${query.phone}\nCity: ${query.city}\nQuery: ${query.query}`,
      html: `<h1>New Query Received</h1><p>Name: ${query.name}</p><p>Email: ${query.email}</p><p>Phone: ${query.phone}</p><p>City: ${query.city}</p><p>Query: ${query.query}</p>`,
    };

    // Send the email to admin
    await transporter.sendMail(adminMailOptions);
    console.log('Email sent to admin');
  } catch (error) {
    console.error('Error sending email to admin:', error);
  }
};

export const sendEmailToUser = async (query) => {
  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stockrootscare@gmail.com',
        pass: 'mlniwtrbisrfzboh',
      },
    });

    // Setup email data with custom format for user
    const userMailOptions = {
      from: 'stockrootscare@gmail.com',
      to: query.email,
      subject: 'Thank You for Your Query',
      text: `Dear ${query.name},\nThank you for your query. We will get back to you as soon as possible.`,
      html: `<h1>Thank You for Your Query</h1><p>Dear ${query.name},</p><p>Thank you for your query. We will get back to you as soon as possible.</p>`,
    };

    // Send the email to user
    await transporter.sendMail(userMailOptions);
    console.log('Email sent to user');
  } catch (error) {
    console.error('Error sending email to user:', error);
  }
};

export const sendEmailToUserFromAdmin = async (query) => {


  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stockrootscare@gmail.com',
        pass: 'mlniwtrbisrfzboh',
      },
    });

    // Setup email data with custom format for user
    const userMailOptions = {
      from: 'stockrootscare@gmail.com',
      to: query.recipients.split(','),
      subject:query.subject,
      html: query.fileContent,
    };

    // Send the email to user
    await transporter.sendMail(userMailOptions);
    console.log('Email sent to user');
  } catch (error) {
    console.error('Error sending email to user:', error);
  }
};

