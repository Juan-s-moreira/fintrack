const mongoose = require('mongoose');

// Função para conectar
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ database Conectado com sucesso, painho!");
    } catch (error) {
        console.error("❌ Erro ao conectar no database, veinho:", error);
        process.exit(1);
    }
};

module.exports = connectDB;