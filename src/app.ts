import cors from "cors";
import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

import { authRouter } from "./router/auth.router";
import { IError } from "./types";

const app: Application = express();

app.use(
  cors({
    origin: "*",
  }),
);
const errorHandler: ErrorRequestHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 400;
  res.status(status).json({
    message: err.message,
    status,
  });
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);

app.use(errorHandler);

export { app };
