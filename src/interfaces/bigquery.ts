export default interface BigQuery {
    privateKey: any;
    clientEmail: any;
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
    projectId?: string; // Optional property for BigQuery
    keyFilename?: string; // Optional property for BigQuery
  }
  