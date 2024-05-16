import express, { Request } from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import { SuccessResponse } from '../../helpers/ApiResponse';
import StockRepo from '../../database/repository/StockRepo';

const router = express.Router();


const stocks = [
    {
      "stockName": "Apple Inc.",
      "quantity": 500,
      "price": 150,
      "createdAt": "2024-05-16T10:00:00.000Z",
      "updatedAt": "2024-05-16T10:00:00.000Z"
    },
    {
      "stockName": "Microsoft Corporation",
      "quantity": 300,
      "price": 300,
      "createdAt": "2024-05-15T14:30:00.000Z",
      "updatedAt": "2024-05-15T14:30:00.000Z"
    },
    {
      "stockName": "Amazon.com Inc.",
      "quantity": 1000,
      "price": 3500,
      "createdAt": "2024-05-14T09:45:00.000Z",
      "updatedAt": "2024-05-14T09:45:00.000Z"
    },
    {
      "stockName": "Google LLC",
      "quantity": 200,
      "price": 2500,
      "createdAt": "2024-05-13T16:20:00.000Z",
      "updatedAt": "2024-05-13T16:20:00.000Z"
    },
    {
      "stockName": "Tesla Inc.",
      "quantity": 150,
      "price": 700,
      "createdAt": "2024-05-12T11:10:00.000Z",
      "updatedAt": "2024-05-12T11:10:00.000Z"
    },
    {
      "stockName": "Facebook Inc.",
      "quantity": 400,
      "price": 350,
      "createdAt": "2024-05-11T14:55:00.000Z",
      "updatedAt": "2024-05-11T14:55:00.000Z"
    },
    {
      "stockName": "Alphabet Inc.",
      "quantity": 600,
      "price": 2200,
      "createdAt": "2024-05-10T10:30:00.000Z",
      "updatedAt": "2024-05-10T10:30:00.000Z"
    },
    {
      "stockName": "Netflix Inc.",
      "quantity": 250,
      "price": 600,
      "createdAt": "2024-05-09T13:40:00.000Z",
      "updatedAt": "2024-05-09T13:40:00.000Z"
    },
    {
      "stockName": "Walmart Inc.",
      "quantity": 800,
      "price": 150,
      "createdAt": "2024-05-08T15:25:00.000Z",
      "updatedAt": "2024-05-08T15:25:00.000Z"
    },
    {
      "stockName": "Johnson & Johnson",
      "quantity": 350,
      "price": 170,
      "createdAt": "2024-05-07T12:15:00.000Z",
      "updatedAt": "2024-05-07T12:15:00.000Z"
    }
  ]
  

//to seed the stock data
router.post(
    '/seed',
    asyncHandler(async (req: Request | any, res) => {
      await StockRepo.createMany(stocks);
  
      return new SuccessResponse(
        'success',
        'Stock seeded'
      ).send(res);
    }),
  );

  router.get(
    '/',
    asyncHandler(async (req: Request | any, res) => {
      const stocks = await StockRepo.findAll();
  
      return new SuccessResponse(
        'success',
        stocks,
      ).send(res);
    }),
  );



export default router;