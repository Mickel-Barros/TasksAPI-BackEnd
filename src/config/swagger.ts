import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Tasks API",
        version: "1.0.0",
        description: "API para gerenciar tarefas"
      }
    },
    apis: ["./src/routes/*.ts"]
  };
  
  console.log("Procurando arquivos de rota em:", "./src/routes/*.ts");
  
  const specs = swaggerJSDoc(options);
  console.log("Especificações do Swagger geradas:", Object.keys(specs));
  
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
};