import express, { Application, Request, Response } from 'express';
import { AppDataSource } from './core/config/database';
import morgan from 'morgan';
import cors from 'cors';
import { Helper } from './core/helper/helper';
import { IResponse } from './apps/models/iResponse.model';
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path'
import indexRoutes from './Routes/index.routes';
import productCategoryRouter from './Routes/productCategory.routes';
import subProductCategoryRouter from './Routes/subProductCategory.routes';
import ProductItemsRouter from './Routes/productItems.routes';
import UserRouter from './Routes/user.routes';
import cartRouter from './Routes/cart.routes';
import razorpayRouter from './Routes/razorpay.routes';
import orderRouter from './Routes/order.route';

export class App {
    private app: Application;
    private helper: Helper;
    public handleRequest: any;
    private MAX_RETRIES: number = 5;
  
    constructor() {
      this.helper = new Helper();
      dotenv.config();
      this.app = express();
      this.settings();
      this.middleware();
      this.routes();
      this.dbInit();
      this.catchInvalidRoutes();
    }
  
    settings() {
      this.app.set('port', 808);
    }
  
    middleware() {
      this.app.use('/src/public',express.static(path.join(__dirname, 'public')))
      this.app.use(morgan('dev'));
      this.app.use(cors());
      this.app.use(express.json());
    }
  
    catchInvalidRoutes() {
      this.app.all('*', (req: Request, res: Response) => {
        const response: IResponse = { status: false, message: 'Invalid route' };
        this.helper.sentMessage(res, response, 404);
      });
  
      this.app.use((err: any, req: Request, res: Response) => {
        const response: IResponse = { status: false, message: err.message };
        this.helper.sentMessage(res, response, 500);
      });
    }
  
    routes() {
        this.app.use(indexRoutes);
        this.app.use('/productcategory',productCategoryRouter)
        this.app.use('/user',UserRouter)
        this.app.use('/subproductcategory',subProductCategoryRouter)
        this.app.use('/productitems',ProductItemsRouter)
        this.app.use('/cart',cartRouter)
        this.app.use('/api/payment',razorpayRouter)
        this.app.use('/order', orderRouter)
  
    }
  
    async attemptConnection(dataSource: any, retryCount = 0): Promise<void> {
      try {
        await dataSource.initialize();
      } catch (err) {
        if (retryCount < this.MAX_RETRIES) {
          // eslint-disable-next-line no-console
          console.error(`Error initializing ${dataSource.name}, retrying...`, err);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 2 seconds delay before retry
          return await this.attemptConnection(dataSource, retryCount + 1);
        } else {
          // eslint-disable-next-line no-console
          console.error(`Failed to initialize ${dataSource.name} after ${this.MAX_RETRIES} attempts.`, err);
          throw err;
        }
      }
    }
  
    async dbInit() {
      try {
        await this.attemptConnection(AppDataSource);
        // eslint-disable-next-line no-console
        console.log('Data sources initialized successfully');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error initializing data sources:', err);
      }
    }
  
    async listen() {
      this.app.listen(this.app.get('port'));
      /* eslint-disable-next-line no-console */
      console.log(`server started at http://localhost:${this.app.get('port')}`);
    }
  }