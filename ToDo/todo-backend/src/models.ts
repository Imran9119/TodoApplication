import { Sequelize, DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS!, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

class Todo extends Model {
    completed: boolean | undefined;
}
Todo.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Todo',
});

class User extends Model {
    password: any;
}
User.init({
    googleId: {
        type: DataTypes.STRING,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'User',
});

User.beforeSave(async (user: User) => {
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

export { sequelize, Todo, User };
