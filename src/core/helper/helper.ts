import { IResponse } from '../../apps/models/iResponse.model';
import { Response } from 'express';

export class Helper {
  static formatResponse(response: IResponse): IResponse {
    return {
      status: response.status,
      message: response.message,
      data: response.data,
    };
  }

  async sentMessage(res: Response, response: IResponse, code?: number, statueType?: number): Promise<void> {
    try {
      const formattedResponse = Helper.formatResponse(response);
      const status = code ?? 200;

      let headers: Record<string, string> = { 'Content-Type': 'application/json' };

      if (statueType === 1) {
        headers = { 'Content-Type': 'application/json' /* other headers */ };
      }

      if (!res.headersSent) {
        res.writeHead(status, headers);
        res.write(JSON.stringify(formattedResponse));
        res.end();
        return;
      } else {
        //console.error('Headers already sent, cannot send "Hello"');
        res.end();
        res.writeHead(status, headers);
        res.write(JSON.stringify(formattedResponse));
        res.end();
        return;
      }
    } catch (error: any) {
      //console.log(error);
      return;
    }
  }
}

export class Validation {
  isUUID(uuid: any) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }
}
