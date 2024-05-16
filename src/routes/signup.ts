import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import asyncHandler from '../helpers/asyncHandler';
import User from '../database/model/User';
import UserRepo from '../database/repository/UserRepo';
import { BadRequestError } from '../helpers/ApiError';
import { SuccessResponse } from '../helpers/ApiResponse';
import JWT from '../helpers/JWT';
import validator from '../helpers/validator';
import schema from '../helpers/schema';

const router = express.Router();

//for signup
router.post(
  '/',
  validator(schema.signup),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser } = await UserRepo.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
      } as User,
    );

    delete createdUser.password;

    const tokens = await JWT.createTokens(
      createdUser,
      accessTokenKey
    );

    new SuccessResponse('Signup Successful', {
      user: createdUser,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
