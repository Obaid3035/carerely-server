import express, {Application} from 'express';
import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
//import rateLimit from 'express-rate-limit';
import AppDataSource from "./config/database";
import {IController} from './interface';
import handleError from './middleware/errorHandler';
// import config from "./config";

class App {
  public app: Application;

  constructor(controllers: IController[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeController(controllers);
    this.initializeErrorHandler();
  }

  public async bootstrap() {
    try {
      // const connection = await createConnection(process.env.CONNECTION_NAME);
      AppDataSource.initialize()
        .then(() => {
          console.log("Data Source has been initialized!")
          this.app.listen(process.env.PORT, () => {
            console.log('Server is up and running');
          });
        })
        .catch((err) => {
          console.error("Error during Data Source initialization", err)
        })
      // if (connection.isConnected) {
      //   console.log("Database connection established")
      //
      // }
    } catch (e) {
      console.log(e);
    }
  }

  private initializeMiddleware() {
    this.app.use(cors({
      origin: ["localhost:3000", "https://carerely-client.herokuapp.com"]
    }));
    this.app.use(helmet());
    // this.app.use(
    //     rateLimit({
    //       windowMs: 15 * 60 * 1000,
    //       max: 100,
    //     }),
    // );
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
  }

  private initializeController(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });
  }

  private initializeErrorHandler() {
    this.app.use(handleError);
  }
}

export default App;
