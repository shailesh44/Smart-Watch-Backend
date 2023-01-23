const nodemailer = require("nodemailer");

const mailhelper = async (options) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMPT_PASS
        },
    });

    const message = {
        from: "noobslayer144@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(message);

}



module.exports = mailhelper;