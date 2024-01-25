import 'dotenv/config'
import express from 'express'
import { __filename, __dirname } from './path.js';
import * as path from 'path';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import session from 'express-session';

//import Routes
import { routerProduct } from './routes/products.routes.js';
import { routerViews } from './routes/views.routes.js';
import { routerUpload } from './routes/upload.routes.js';
import { routerCarts } from './routes/carts.routes.js';

//import contollers
import { managerMessages} from './controllers/Messages.js';

const app = express();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

//Routes
app.use('/', express.static(__dirname + '/public'));
app.use('/', routerViews);
app.use('/upload', routerUpload);
app.use('/api/products', routerProduct);
app.use('/api/carts', routerCarts)

app.set("port", process.env.PORT || 8080);

const server = app.listen(app.get("port"), () => console.log(`Server on port ${app.get("port")}`));


connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://menichinidinopaolo:Romi6282@cluster1.zr0m6.mongodb.net/?retryWrites=true&w=majority')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}
//Socket.io

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Cliente conectado");
    managerMessages.getElements().then((messages) => {
        socket.emit("allMessages", messages);
    })

    socket.on("message", async (info) => {
        managerMessages.addElements([info]).then(() => {
            managerMessages.getElements().then((messages) => {
                socket.emit("allMessages", messages);
            })
        })
    })
})