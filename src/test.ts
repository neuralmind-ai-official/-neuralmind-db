import NeuralmindDB from "./index";

(async () => {
  const test = new NeuralmindDB("mysql", "your-api-key", {
    database: "store",
    username: "root",
    password: "db-password",
    host: "127.0.0.1",
    port: 3306,
  });

  await test.connect(); // check the connection
  await test.sync(); // Sync the schema to our server (Identified by your API key)
  const query = await test.query("Which products are expensive?"); // A query (In this case SQL) that you can run anywhere you want or even in our library

  console.log(await test.run(query));
})();
