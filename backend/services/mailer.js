const axios = require('axios');

const sendVerificationEmail = async (email, code) => {
    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { 
                email: process.env.EMAIL_USER, 
                name: 'FinTrack App' 
            },
            to: [{ email: email }],
            subject: 'Seu código de verificação - FinTrack',
            htmlContent: `
                <div style="font-family: sans-serif; background-color: #f9fafb; padding: 40px; text-align: center;">
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #e5e7eb; display: inline-block; width: 100%; max-width: 400px;">
                        <h2 style="color: #111827;">Olá, painho! 🚀</h2>
                        <p style="color: #4b5563;">Use o código abaixo para validar seu cadastro no FinTrack:</p>
                        <div style="margin: 30px 0; background-color: #eff6ff; padding: 15px; border-radius: 12px;">
                            <h1 style="color: #2563eb; letter-spacing: 5px; margin: 0; font-size: 32px;">${code}</h1>
                        </div>
                        <p style="color: #9ca3af; font-size: 12px;">Se você não solicitou este código, apenas ignore este e-mail.</p>
                    </div>
                </div>`
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Erro na API do Brevo:", error.response?.data || error.message);
        throw new Error("Falha ao enviar e-mail de verificação");
    }
};

module.exports = { sendVerificationEmail };