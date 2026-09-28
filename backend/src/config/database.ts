import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI || '';
        await mongoose.connect(mongoURI);

        console.log(" database Conectado com sucesso, painho!");
    } catch (error) {
        console.error(" Erro ao conectar no database, veinho:", error);
        process.exit(1);
    }
};

