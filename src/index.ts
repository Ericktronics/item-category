import express from "express";

const app = express();

app.use(express.json());

const apiRouter = [
  {
    path: "/api/category",
    route: require("./routes/category.routes").default,
  },
  {
    path: "/api/item",
    route: require("./routes/item.routes").default,
  },
];

apiRouter.forEach((route) => {
  app.use(route.path, route.route);
});
  

export default app;
