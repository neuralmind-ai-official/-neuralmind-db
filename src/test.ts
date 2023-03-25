import NeuralmindDB from "./index";

(async () => {
  const test = new NeuralmindDB("mongodb", "s", {
    database: "s",
    username: "s",
    password: "s",
    host: "sdf",
    port: 27017,
  });

  await test.connect();
  // We can do hard filter
  const rules = [
    {
      name: "owner",
      required: true,
      rule: "Every query need to include owner key with a pair ${ownerValue}",
    },
  ];

  await test.sync(["articles", "agents"], rules);
  const query = await test.query(
    "Can you check an article with a model name test? owner: sdfasdf"
  );

  console.log(query);

  console.log(await test.run(query));
})();
