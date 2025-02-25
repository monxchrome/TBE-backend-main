export interface IError extends Error {
  status: number;
  message: string;
}

interface IIndex {
  [key: string]: any;
}

export type IRequest = IIndex;
