import { Sequelize } from "sequelize";
import { Sequelize as SequelizeBigQuery } from 'sequelize-bigquery';
import bigquery from "../interfaces/bigquery";

const connectBigQuery = async (payload: bigquery) => {
  try {
    const sequelize = new SequelizeBigQuery({
      dialect: 'bigquery',
      projectId: payload.projectId,
      credentials: {
        client_email: payload.clientEmail,
        private_key: payload.privateKey
      }
    });

    await sequelize.authenticate();

    return sequelize;
  } catch (error) {
    return false;
  }
};

export default connectBigQuery;
