import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import sequelize from './db/index';
import userRoutes from './routes/webRoute';
import apiRoutes from './routes/apiRoute';
import bodyParser from 'body-parser';
import path from 'path';
import { engine } from 'express-handlebars';
import session from 'express-session';
import { errorHandler } from './utils/helper';
// import 'log-timestamp';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(session({
    secret: 'ALPHA1',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.session = req.session;
    next();
});

const sections: { [key: string]: string } = {};
const sectionHelper = (name: string, options: any) => {
    console.log(`Section helper called for: ${name}`);
    sections[name] = options.fn(this);
    console.log("🚀 ~ sections:", sections);
    return '';
};

const helpers = {
    section: sectionHelper
}

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../src/views/layouts'),
    partialsDir: path.join(__dirname, '../src/views/partials'),
    helpers
}));



app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../src/views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', userRoutes);
app.use('/api', apiRoutes);

app.use(errorHandler);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch(error => console.error(" == Dbs Erros == ", error));
