import express, { Request } from 'express';
import UserRepo from '../../database/repository/UserRepo';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import { SuccessResponse } from '../../helpers/ApiResponse';
import { BadRequestError } from '../../helpers/ApiError';
import authentication from '../../helpers/authentication';
import PortfolioRepo from '../../database/repository/PortfolioRepo';
import schema from '../../helpers/schema';
import validator from '../../helpers/validator';
import StockRepo from '../../database/repository/StockRepo';

const router = express.Router();

//for JWT verification
router.use(authentication);


//api to get user details
router.get(
    '/me',
    asyncHandler(async (req: Request | any, res) => {
      const user = await UserRepo.findById(req.user._id);
      if (!user) throw new BadRequestError('User not registered');
  
      return new SuccessResponse(
        'success',
        _.pick(user, ['name', 'email']),
      ).send(res);
    }),
  );


  //api to get portfolio
  router.get(
    '/portfolio',
    asyncHandler(async (req: Request | any, res) => {
      const portfolios = await PortfolioRepo.findAll(req.user._id);
  
      return new SuccessResponse(
        'success',
        portfolios,
      ).send(res);
    }),
  );


  //api to buy stocks
  router.post(
    '/portfolio/buy',
    validator(schema.createPortfolio),
    asyncHandler(async (req: Request | any, res) => {

      const data: any = {
        userId: req.user._id,
        stockId: req.body.stockId,
        quantity: req.body.quantity
      }

      const getStock = await StockRepo.findById(data.stockId);
      const getPortfolioStock = await PortfolioRepo.findByStockId(data.stockId);


      if (!getStock) throw new BadRequestError('stock not found');

      if ((getStock?.quantity ?? 0) < data.quantity) throw new BadRequestError('stock not available');

      data.price = data.quantity * (getStock?.price ?? 0);

      const stockUpdate = {
        _id: getStock._id,
        quantity: (getStock?.quantity ?? 0) - data.quantity
      }

      let portfolios;
      if(getPortfolioStock) {
        const update = {
          _id: getPortfolioStock._id,
          quantity: data.quantity + getPortfolioStock.quantity,
          price: data.price + getPortfolioStock.price,
        }
        portfolios = await PortfolioRepo.update(update, stockUpdate)
      } else {
        portfolios = await PortfolioRepo.create(data, stockUpdate);

      }

      return new SuccessResponse(
        'success',
        portfolios,
      ).send(res);
    }),
  );

  //api to sell stocks
  router.post(
    '/portfolio/sell',
    validator(schema.sellPortfolio),
    asyncHandler(async (req: Request | any, res) => {

      const data: any = {
        userId: req.user._id,
        id: req.body.id,
        quantity: req.body.quantity
      }

      const getPortfolioStock = await PortfolioRepo.findById(data.id, data.userId);
      const getStock = await StockRepo.findById(getPortfolioStock?.stockId ?? '');


      if (!getPortfolioStock || !getStock) throw new BadRequestError('stock not found');

      if (data.quantity > (getPortfolioStock.quantity ?? 0)) throw new BadRequestError('Dont have enough stock to sell');

      data.price = data.quantity * (getStock?.price ?? 0);

      const stockUpdate = {
        _id: getStock._id,
        quantity: (getStock?.quantity ?? 0) + data.quantity
      }

      let portfolios;
      if(getPortfolioStock) {
        const update = {
          _id: getPortfolioStock._id,
          quantity: (getPortfolioStock.quantity ?? 0) - data.quantity,
          price: (getPortfolioStock.price ?? 0) - data.price,
        }
        portfolios = await PortfolioRepo.update(update, stockUpdate)
      }

      return new SuccessResponse(
        'success',
        portfolios,
      ).send(res);
    }),
  );



export default router;