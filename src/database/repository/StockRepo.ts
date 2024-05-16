import Stock, { StockModel } from '../model/Stocks';

async function findAll(): Promise<Stock[] | null> {
  return StockModel.find({ })
    .lean()
    .exec();
}

async function findById(id: string): Promise<Stock | null> {
  return StockModel.findOne({ _id: id })
    .lean()
    .exec();
}

async function createMany(
  Stocks: Stock[],
): Promise<{ message: String }> {
  const now = new Date();

  await StockModel.insertMany(Stocks);
  return {
    message: 'stock seeded',
  };
}

export default {
  findAll,
  createMany,
  findById
};
