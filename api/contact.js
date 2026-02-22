// Serverless function for OnRecord Title contact form
// Sends emails via SendGrid API

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { name, email, phone, contact_method, subject, message, fax_number, timestamp } = req.body;
    
    // Honeypot check
    if (fax_number) {
      return res.status(200).json({ success: true, message: 'Thank you for your message.' });
    }
    
    // Timestamp check (must be >3s since page load)
    if (timestamp && Date.now() - parseInt(timestamp) < 3000) {
      return res.status(200).json({ success: true, message: 'Thank you for your message.' });
    }
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    // TODO: Send email via SendGrid
    // For now, log to console (replace with actual SendGrid integration)
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      contact_method,
      subject,
      message,
      timestamp: new Date().toISOString()
    });
    
    // TODO: Replace this comment with actual SendGrid API call:
    /*
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_API_KEY);
    
    const msg = {
      to: 'info@onrecordtitle.com',
      from: 'contact@onrecordtitle.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nPreferred Contact: ${contact_method || 'Email'}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Preferred Contact:</strong> ${contact_method || 'Email'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h4>Message:</h4>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    await sgMail.send(msg);
    */
    
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you within one business day.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to send message. Please try again or call us directly at 385-464-2060.'
    });
  }
}
