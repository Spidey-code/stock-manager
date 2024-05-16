import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import UserRepo from '../database/repository/UserRepo';
import { BadRequestError, InternalError } from '../helpers/ApiError';
import { AuthFailureError } from '../helpers/ApiError';
import { SuccessResponse } from '../helpers/ApiResponse';

import JWT from '../helpers/JWT';
import asyncHandler from '../helpers/asyncHandler';
import validator from '../helpers/validator';
import schema from '../helpers/schema';

const router = express.Router();


//for login
router.post(
  '/',
  validator(schema.credential),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.password) throw new BadRequestError('Credential not set');

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError('Authentication failure');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');

    const tokens = await JWT.createTokens(user, accessTokenKey);

    delete user.password;

    new SuccessResponse('Login Success', {
      user,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
