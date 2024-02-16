import { Request, Response } from 'express';
import { IResponse } from '../models/iResponse.model';
import { Helper } from '../../core/helper/helper';

export class IndexController {
  private helper: Helper;

  constructor() {
    this.helper = new Helper();
  }

  welcome(req: Request, res: Response): void {
    const response: IResponse = { status: true, message: 'Welcome to CQwiki API' };
    this.helper.sentMessage(res, response, 200);
  }

  protected(req: Request, res: Response) {
    try {
      const response: IResponse = { status: true, message: 'Welcome to CQwiki API' };
      this.helper.sentMessage(res, response, 200);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  }
}
