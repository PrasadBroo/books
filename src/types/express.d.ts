import { TUser } from "../db/schema/users";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: TUser
    }
  }
}
