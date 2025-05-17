// Dependencies
import cors from "cors";

export const corsConfig = (app: any) => {
  app.use(cors());
};
