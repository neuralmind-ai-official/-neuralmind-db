import NeuralmindDB from "./index";

(async () => {
  const test = new NeuralmindDB(
    "postgres",
    "5942137df5c9672ef3577cf4ef8fc224",
    {
      database: "postgres",
      username: "abraham",
      password: "new_password",
      host: "127.0.0.1",
      port: 5432,
    }
  );

  await test.connect(); // check the connection
  // We can do hard filter
  const rules = [
    {
      name: "user_id",
      required: true,
      rule: "Every query need to include user_id and user_id value will be ${user_id}",
    },
  ];

  await test.sync([], rules);

  let query = await test.query("What is my bio?"); // A query (In this case SQL) that you can run anywhere you want or even in our library
  // let's replace ${user_id} with actual userId,
  const userId = 2; // this can be set by you
  query = query.replace(`\${user_id}`, `${userId}`);
  console.log(query);
  console.log(await test.run(query));
})();
