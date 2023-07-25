import config from './config.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_ACCOUNT,
        pass: config.GMAIL_PASS
    }
});

export default transporter;