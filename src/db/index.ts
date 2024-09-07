import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('kwanso', 'root', '', {
    host: 'localhost',
    dialect: 'mysql', 
});


export default sequelize;
