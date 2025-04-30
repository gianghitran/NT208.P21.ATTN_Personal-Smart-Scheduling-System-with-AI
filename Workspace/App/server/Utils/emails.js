const { VERIFICATION_EMAIL_TEMPLATE } = require('./emailTemplate.js');
const { emailTransport, sender } = require('./emailConfig.js');

const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = email;

    try {
        const response = await emailTransport.sendMail({
            from: sender,
            to: recipient,
            subject: "Email Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email: " + error.message);
    }
}

module.exports = {
    sendVerificationEmail,
};