import express, { Express } from "express";
import routes from "./routes";

const router: Express = express();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** Routes */
router.use("/", routes);

/** 404 */
router.use((_req, res) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

const PORT: any = process.env.PORT ?? 6060;

router.listen(PORT, () =>
  console.log(`🚀 API server ready at: http://localhost:${PORT}`)
);
