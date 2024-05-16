import express from 'express';
import user from './portfolio';
import stock from './stock';
import login from './login';
import signup from './signup';

const router = express.Router();

router.use('/login', login);
router.use('/signup', signup);
router.use('/stock', stock)
router.use('/', user);

export default router;
