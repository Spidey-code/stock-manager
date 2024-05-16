import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Portfolio';
export const COLLECTION_NAME = 'portfolios';

export default interface Portfolio {
  _id?: Types.ObjectId;
  stockId?: string;
  userId?: string;
  quantity?: number;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Portfolio>(
  {
    quantity: {
      type: Schema.Types.Number,
      default: 0
    },
    price: {
      type: Schema.Types.Number,
    },
    stockId: {
        type: Schema.Types.ObjectId,
        ref: 'Stock',
        required: true,
        unique: true,
        index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);


export const PortfolioModel = model<Portfolio>(DOCUMENT_NAME, schema, COLLECTION_NAME);
