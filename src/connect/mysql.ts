import { Sequelize } from "sequelize";
import mysql from "../interfaces/mysql";

const connectMySQL = async (payload: mysql) => {
  try {
    const sequelize = new Sequelize(            //instance of sequelize
      payload.database,
      payload.username,
      payload.password,
      {
        host: payload.host,
        port: payload.port,
        dialect: "mysql",
        logging: false,
      }
    );

    await sequelize.authenticate();

    return sequelize;
  } catch (error) {
    return false;
  }
};

export default connectMySQL;
