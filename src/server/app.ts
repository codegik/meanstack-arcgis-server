import * as express     from "express";
import * as http        from "http";
import * as serveStatic from "serve-static";
import * as path        from "path";
import * as socketIo    from "socket.io";
import * as mongoose    from "mongoose";
import { MapSocket }    from "./map.socket";

declare var process, __dirname;

class Server {
    public app: any;
    private server: any;
    private io: any;
    private mongo: any;
    private root: string;
    private port: number;

    // Bootstrap the application.
    public static start(): Server {
        return new Server();
    }

    constructor() {
        // Create expressjs application
        this.app = express();

        // Configure application
        this.config();

        // Setup routes
        this.routes();

        // Create server
        this.server = http.createServer(this.app);

        // Create database connections
        this.databases();
        
        // Start listening
        this.listen();

        // Handle websockets
        this.sockets();
    }

    // Configuration
    private config(): void {
        // By default the port should be 5000
        this.port = process.env.PORT || 5000;

        // root path is under ../../target
        this.root = path.join(path.resolve(__dirname, '../../target'));

    }

    // Configure routes
    private routes(): void {
        let router: express.Router = express.Router();

        // Static assets
        this.app.use('/assets', serveStatic(path.resolve(this.root, 'assets')));

        // Set app to use router as the default route
        this.app.use('*', router);
    }

    // Configure databases
    private databases(): void {
        // MongoDB URL
        let mongoDBUrl = process.env.MONGODB_URI || 'mongodb://localhost/map';

        // Get MongoDB handle
        this.mongo = mongoose.connect(mongoDBUrl);
    }

    // Configure sockets
    private sockets(): void {
        this.io = socketIo(this.server);
        new MapSocket(this.io);
    }
    
    // Start HTTP server listening
    private listen(): void {
        //listen on provided ports
        this.server.listen(this.port);

        //add error handler
        this.server.on("error", error => {
            console.log("ERROR", error);
        });

        //start listening on port
        this.server.on("listening", () => {
            console.log('==> Listening on port %s.', this.port);            
        });
    }
}

// Start the server
let server = Server.start();
export = server.app;