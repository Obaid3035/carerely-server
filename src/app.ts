import express, {Application} from 'express';
import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
//import rateLimit from 'express-rate-limit';
import {createConnection} from 'typeorm';
import {IController} from './interface';
import config from './config';
import handleError from './middleware/errorHandler';

class App {
  public app: Application;

  constructor(controllers: IController[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeController(controllers);
    this.initializeErrorHandler();
  }

  public async bootstrap() {
    const connection = await createConnection(process.env.CONNECTION_NAME);
    if (connection.isConnected) {
      await this.app.listen(config.port, () => {
        console.log('Server is up and running ');
      });
    }
  }

  private initializeMiddleware() {
    this.app.use(cors());
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
