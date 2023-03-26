import { Sequelize } from "sequelize";
import redshift from "../interfaces/redshift";

const connectRedshift = async (payload: redshift) => {
  try {
    const sequelize = new Sequelize(
      payload.database,
      payload.username,
      payload.password,
      {
        host: payload.host,
        port: 5439,          //redshift port
        dialect: "postgres",
        logging: false,
      }
    );

    await sequelize.authenticate();

    return sequelize;
  } catch (error) {
    return false;
  }
};

export default connectRedshift;
