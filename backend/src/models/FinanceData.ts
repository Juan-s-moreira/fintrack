import { Schema, model, Document, Types } from 'mongoose';

export type TransactionType = 'income' | 'expense';
export type ExpenseCategory = 'Alimentacao' | 'Transporte' | 'lazer' | 'Utilidades' | 'Saude' | 'Educacao' | 'other';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'dinheiro';
export type RecurrenceFrequency = 'Unica' | 'Diario' | 'Semanal' | 'Mensal' | 'Anual';

export interface IFinanceData extends Document {
    userId: Types.ObjectId;
    description: string;
    value: number;
    type: TransactionType;
    category: ExpenseCategory;
    paymentMethod: PaymentMethod;
    isRecurring: boolean;
    recurrenceFrequency: RecurrenceFrequency;
    installments?: {
        current: number;
        total: number
    }
    fitId: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<IFinanceData>({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },
    category: {
        type: String,
        required: true,
        default: 'other',
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'pix', 'boleto', 'dinheiro']
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrenceFrequency: {
        type: String,
        enum: ['Unica', 'Diario', 'Semanal', 'Mensal', 'Anual'],
        required: function(this: IFinanceData) {
            return this.isRecurring ===  true
        }
    },
    installments: {
        current: {type: Number},
        total: {type: Number}
    },
    fitId: {
        type: String,
        unique: true,
        sparse: true
    }
    }, {
        timestamps: true

    })

export const Transaction = model<IFinanceData>('FinanceData', TransactionSchema);