import express from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import passport from 'passport';
import { setupAuth } from './auth';
import { todoRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());

setupAuth(app);

app.use('/api/todos', todoRoutes);

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS!, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log('Error connecting to the database', error));
