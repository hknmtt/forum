import express, { Application } from "express";

import router from "./api/api.router";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./openapi.json";
import { errorHandler } from "./api/error-handler";
import bodyParser from "body-parser";

const app: Application = express();

app.use(
  "/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
    // explorer: true,
  })
);

app.use(bodyParser.json());

app.use("/v1", router);

app.use(errorHandler);

export default app;
