import express, {ErrorRequestHandler, Request, Response} from "express";
import {IError} from "./types";
import {configs} from "./configs";
import * as mongoose from "mongoose";

const app = express()
const errorHandler: ErrorRequestHandler = (err: IError, req: Request, res: Response) => {
    const status = err.status || 400;
    res.status(status).json({
        message: err.message,
        status,
    });
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(errorHandler);

app.listen(configs.PORT, async () => {
    await mongoose.connect(configs.DB_URL)
    console.log(`Server has started on port: ${configs.PORT}`);
})