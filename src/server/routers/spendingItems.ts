import { z } from "zod";
import { UnsavedSpendingItem } from "../../utils/types";
import { publicProcedure, router } from "../trpc";
import {
  deleteSpendingItem,
  findSpendingItems,
  saveSpendingItem,
} from "../repositories/spendingItems";

export const spendingItemsRouter = router({
  spendingItems: publicProcedure
    .input(z.object({ moreRecentThanEqual: z.string(), olderThan: z.string() }))
    .query(async (req) => {
      const { moreRecentThanEqual, olderThan } = req.input;

      const spendingItems = await findSpendingItems({
        moreRecentThanEqual,
        olderThan,
      });

      return { spendingItems };
    }),

  replaceSpendingItems: publicProcedure
    .input(
      z.object({
        moreRecentThanEqual: z.string(),
        olderThan: z.string(),
        spendingItems: UnsavedSpendingItem.array(),
      })
    )
    .mutation(async (req) => {
      const {
        moreRecentThanEqual,
        olderThan,
        spendingItems: newItems,
      } = req.input;

      const existingItems = await findSpendingItems({
        moreRecentThanEqual,
        olderThan,
      });
      await Promise.all([
        ...existingItems.map((item) => deleteSpendingItem(item.id)),
        ...newItems.map((item) => saveSpendingItem(item)),
      ]);

      return {};
    }),
});
