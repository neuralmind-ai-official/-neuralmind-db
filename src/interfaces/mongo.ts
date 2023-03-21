export default interface mongodb {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
    options?: object;
  }