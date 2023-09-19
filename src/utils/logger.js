import winston from "winston"

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    }, 
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red',
    }
};

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple(),
            )
        }),
        new winston.transports.File({ 
            filename:"./errors.log", 
            level:"error",
            format: winston.format.simple()
        }),
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple(),
            )
        }),
        new winston.transports.File({ 
            filename:"./errors.log", 
            level:"error",
            format: winston.format.simple()
        }),
    ]
})

export const addLogger = (req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === "development";
    req.logger = isDevelopment ? devLogger : prodLogger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}