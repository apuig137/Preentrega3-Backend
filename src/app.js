import express from "express";
import session from "express-session";
import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import realTimeProductsRouter from "./routes/realTimeProducts.router.js"
import chatRouter from "./routes/chat.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import viewsRouter from "./routes/views.router.js"
import ticketRouter from "./routes/ticket.router.js"
import usersRouter from "./routes/users.router.js"
import handlebars from "express-handlebars"
import __dirname from "./utils.js";
import { Server } from "socket.io"
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import displayRoutes from "express-routemap";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import { addLogger } from "./utils/logger.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

const app = express()
const PORT = 8080
const MONGO = `${config.db}`
mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion API Adopme',
            description: 'Documentacion para uso de swagger!!'
        }
    },
    apis: [`./src/docs/**/*.yaml`]
}

// creamos el specs
const specs = swaggerJSDoc(swaggerOptions);
// Declaramos swagger API - endpoint
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 3600,
    }),
    secret: "CoderSecretSHHHHH",
    resave: false,
    saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(cookieParser());
app.use(addLogger)

app.use("/api/carts", cartRouter)
app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/realtimeproducts", realTimeProductsRouter)
app.use("/api/chat", chatRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/tickets", ticketRouter)
app.use("/api/users", usersRouter)

const httpServer = app.listen(PORT, () => {
    displayRoutes(app)
    console.log(`Servidor arriba en el puerto ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on("connection", async socket => {
    console.log("Nuevo cliente conectado en realTimeProducts", socket.id)
    socket.on("product", (data) => {
        console.log(data)
    })
})
