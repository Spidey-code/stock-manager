import mongoose, { Types } from 'mongoose';
import Portfolio, { PortfolioModel } from '../model/portfolio';
import Stock, { StockModel } from '../model/Stocks';

async function findAll(userId: string): Promise<Portfolio[] | null> {
  return PortfolioModel.find({ userId})
    .populate('stockId')
    .lean()
    .exec();
}

async function findByStockId(id: string): Promise<Portfolio | null> {
  return PortfolioModel.findOne({ stockId: id })
    .lean()
    .exec();
}

async function findById(id: string, userId: string): Promise<Portfolio | null> {
  return PortfolioModel.findOne({ _id: id, userId: userId })
    .lean()
    .exec();
}

async function create(
  Portfolio: Portfolio,
  Stock: Stock
): Promise<{ Portfolio: Portfolio | undefined  }> {  
  let portfolio: any;

  const session = await mongoose.startSession();
  session.startTransaction();
try {
  const now = new Date();
  Portfolio.createdAt = Portfolio.updatedAt = now;
  portfolio = await PortfolioModel.create(Portfolio);
  await StockModel.updateOne({ _id: Stock._id }, { $set: { ...Stock } }).lean().exec();
  await session.commitTransaction();
  return {
    Portfolio: { ...portfolio.toObject()._doc },
  };
} catch (error) {
  await session.abortTransaction();
  console.error(error);
}

return portfolio;
}

async function update(
  Portfolio: Portfolio,
  Stock: Stock
): Promise<{ Portfolio: Portfolio | undefined }> {

  let portfolio: any;
  const session = await mongoose.startSession();
  session.startTransaction();
try {
  console.log(Portfolio, Stock)
  Portfolio.updatedAt = new Date();
  await PortfolioModel.updateOne({ _id: Portfolio._id }, { $set: { ...Portfolio } })
    .lean()
    .exec();
    await StockModel.updateOne({ _id: Stock._id }, { $set: { ...Stock } }).lean().exec();
    await session.commitTransaction();
    return { Portfolio: Portfolio };
} catch (error) {
  await session.abortTransaction();
  console.error(error);
}

return portfolio;
}

export default {
  findAll,
  findByStockId,
  create,
  update,
  findById
};
