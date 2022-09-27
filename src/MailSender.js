const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    // init connection to mail trap
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    // create / prepare mail content
    const message = {
      from: 'Open Music App',
      to: targetEmail,
      subject: 'Ekspor Playlist pilihan',
      text: 'Terlampir hasil dari ekspor catatan',
      attachments: [
        {
          filename: 'playlist.json',
          content,
        },
      ],
    };

    // at the same time, return(end method) and pass message to nodemailer via transporter
    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
