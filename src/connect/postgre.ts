import { Sequelize } from "sequelize";
import postgre from "../interfaces/postgre";

const connectPostgre = async (payload: postgre) => {
  try {
    const sequelize = new Sequelize( //instance of sequelize
      payload.database,
      payload.username,
      payload.password,
      {
        host: payload.host,
        port: payload.port,
        dialect: "postgres",
        logging: false,
      }
    );

    await sequelize.authenticate();

    return sequelize;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default connectPostgre;
