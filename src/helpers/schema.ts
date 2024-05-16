import Joi from 'joi';
import { JoiAuthBearer } from './validator';

export default {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
  signup: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
  createPortfolio: Joi.object().keys({
    stockId: Joi.string().required(),
    quantity: Joi.number().required().min(0),
  }),
  sellPortfolio: Joi.object().keys({
    id: Joi.string().required(),
    quantity: Joi.number().required().min(0),
  }),
};
