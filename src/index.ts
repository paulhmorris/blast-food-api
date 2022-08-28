import express, { Express } from "express";
import routes from "./routes";

const router: Express = express();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** Routes */
router.use("/", routes);

const PORT: any = process.env.PORT ?? 6060;

router.listen(PORT, () =>
  console.log(`🚀 API server ready at: http://localhost:${PORT}`)
);
