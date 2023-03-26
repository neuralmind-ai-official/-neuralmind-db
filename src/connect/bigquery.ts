import { BigQuery } from '@google-cloud/bigquery';
import bigquery from '../interfaces/bigquery';

const connectBigQuery = async (payload: bigquery) => {
  try {
    const client = new BigQuery({
      projectId: payload.projectId,
      credentials: {
        client_email: payload.clientEmail,
        private_key: payload.privateKey,
      },
    });

    return client;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default connectBigQuery;

