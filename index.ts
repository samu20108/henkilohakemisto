import express from "express";
import path from "path";
import errorhandler from "./errors/errorhandler";
import apiPersonnelRouter from "./routes/apiPersonnel";
import cors from "cors";

const app: express.Application = express();
const port: number = Number(process.env.PORT || 3105);

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.static(path.resolve(__dirname, "./public")));
app.use("/api/personnel", apiPersonnelRouter);
app.use(
  "/api/img/personnel",
  express.static(path.resolve(__dirname, "./img/personnel"))
);
app.use(errorhandler);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!res.headersSent) {
      res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
