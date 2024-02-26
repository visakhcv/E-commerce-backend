
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { accessToken, refreshToken } from "../../core/helper/jwt.utils";

export class jwtMiddlewareController {
    public async jwtTokenGenerator(userId: number) {
        const accesstoken = jwt.sign({ userId }, accessToken, {
            expiresIn: '1d'
        });

        const refreshtoken = jwt.sign({ userId }, refreshToken, {
            expiresIn: '7d'
        });

        return {
            accessToken: accesstoken,
            refreshToken: refreshtoken
        };
    }

    public async jwtMiddleware(req: Request, res: Response, next: Function) {
        try {
            interface JwtPayload {
                userId: number;
            }

            // Access token via auth
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token == null) {
                return res.status(401).json({ message: "Token required" });
            }

            const data = jwt.verify(token, accessToken) as JwtPayload;

            if (data) {
                req.body.userId = data.userId;
                next();
            } else {
                res.status(402).json({ message: "Error occurred. Please login" });
            }
        } catch (err) {
            res.status(404).json({ message: "Error occurred. Please login" });
        }
    }
}
