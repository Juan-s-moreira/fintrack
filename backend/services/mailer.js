const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  }
});


transport.verify(function(error, success) {
  if (error) {
    console.log("Erro na ligação ao e-mail:", error);
  } else {
    console.log("Servidor de e-mail pronto para enviar mensagens!");
  }
});

module.exports = transport;