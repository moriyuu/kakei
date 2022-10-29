import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const helloRouter = router({
  hello: publicProcedure.input(z.object({ name: z.string() })).query((req) => {
    const name = req.input.name;
    return { text: `Hello, ${name}!` };
  }),
});
