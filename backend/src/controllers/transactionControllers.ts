import {Request, Response} from "express";
import { Transaction } from "../models/FinanceData";

// adicionar
export const addTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            description,
            value,
            type,
            category,
            paymentMethod,
            isRecurring,
            recurrenceFrequency,
            installments,
            fitId
        } = req.body;

        const transaction = await Transaction.create({
            description,
            value,
            type,
            category: category || 'other',
            paymentMethod: paymentMethod,
            isRecurring: isRecurring || false,
            recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
            installments,
            userId: ( req as any).user.id
        })

        res.status(200).json({
            message: 'Dado adicionado com sucesso, painho',
            transactions : transaction,
        })
    } catch (error) {
    console.error("Erro ao adicionar transação, painho:", error);
    res.status(400).json({error: "erro ao adicionar"})
}
}

// deletar
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
   const { id } = req.params;
   
    try{
        const deletedTranssaction = await Transaction.findByIdAndDelete(id);

        if(!deletedTranssaction){
            res.status(404).json({error: "Transacao nao enconntrada, papai"})
            return
    }

    res.status(200).json({
        message: "Transacao deletada painho"
    })
} catch (error) {
    console.error("erro ao deletar painho:", error)
    res.status(500).json({error: "erro ao deletar transacao"})
}
}

// Listar Transações
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const transactions = await Transaction.find({ userId: (req as any).user.id }).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ error: 'erro ao verificar transacoes'})
    }
}

// dados mensais
export const getMonthlyTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id
        const currentDate = new Date();

        const mes = req.query.month ? Number(req.query.month) : currentDate.getMonth() + 1  
        const ano = req.query.year ? Number(req.query.year) : currentDate.getFullYear()

        const monthBegin = new Date(ano, mes -1, 1, 0, 0, 0)
        const monthEnd = new Date(ano, mes, 0, 23, 59, 59)

        const prevTransactions = await Transaction.find({
            userId: userId,
            createdAt: {$lt: monthBegin}
        })

        const startingBalance = prevTransactions.reduce((acumulador: number, item: any) => {
            if(item.type === 'income'){
                return acumulador + item.value
            } else {
                return acumulador - item.value
            }
        }, 0)

        const monthlyTransactions = await Transaction.find({
            userId: userId,
            createdAt: {$gte: monthBegin, $lte: monthEnd}
        }).sort({ createdAt: -1 })

        res.status(200).json({
            startingBalance,
            transactions: monthlyTransactions,
            referenceMonth: mes,
            referenceYear: ano
        })
} catch (error) {
    console.error("erro na busca mensal painho", error)
    res.status(500).json({error: "errp ao verificar dados mensais, tente depois pai"})
}
}

// atualizar dados
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
             updateData,
              { new: true, runValidators: true }
            );
            

            if(!updatedTransaction){
                res.status(400).json({error: "Transacao nao encontrada, papai"})
                return
            }

            res.status(200).json({
                message: "Transacao atualizada com sucesso painho",
                data: updatedTransaction
            })
    } catch ( error){
        console.error("erro ao atualizar transacao, papai", error)
        res.status(500).json({error: "erro ao atualizar transacao, tente depois papai"})
    }
}
