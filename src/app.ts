import express, { Request, Response, NextFunction } from 'express';
const app = express();
import mongoose from 'mongoose';
import routes from './routes';
import { ApiError, ErrorType, NotFoundError } from './helpers/ApiError';



//middleware
app.use(express.json());

//configure mongoose

const options = {
    autoIndex: true,
    connectTimeoutMS: 60000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/CRUD", options
).then(() => {
    console.info('Mongoose connection done');
  })
  .catch((e) => { 
    console.info('Mongoose connection error');
    console.error(e);
  });

  // Routes
app.use('/', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      console.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
  } else {
    console.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    console.error(err);
      return res.status(400).send(err.message);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
}); 

export default app;
