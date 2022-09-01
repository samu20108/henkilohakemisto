import express from "express";
import { CustomError } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";

const apiPersonnelRouter: express.Router = express.Router();
apiPersonnelRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiPersonnelRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(await prisma.henkilo.findMany());
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiPersonnelRouter;
