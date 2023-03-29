import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";

export interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.use("*", poweredBy());

app.get("/", (c) => {
  return c.text("Hello Hono !!");
});

app.get("/hello", async (c) => {
  const companyName = c.req.query("company");
  console.log("companyName", companyName);
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM Customers WHERE CompanyName = ?"
  )
    .bind(companyName ?? "")
    .all();

  return c.json({
    ok: true,
    results,
  });
});

export default app;
