import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Stock';
export const COLLECTION_NAME = 'stocks';

export default interface Stock {
  _id?: Types.ObjectId;
  stockName?: string;
  quantity?: number;
  price?: number;
  createdAt?: Date | string;
  updatedAt?: Date| string;
}

const schema = new Schema<Stock>(
  {
    stockName: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    quantity: {
      type: Schema.Types.Number,
      default: 0
    },
    price: {
      type: Schema.Types.Number,
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


export const StockModel = model<Stock>(DOCUMENT_NAME, schema, COLLECTION_NAME);
