import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../src/lib/microcms";
import { SpendingItem } from "../../src/utils/types";

type Data = void;

const validateSpendingItems = (items: unknown): boolean => {
  if (!Array.isArray(items)) {
    return false;
  }
  return !items.some((item) => {
    if (item == null) {
      return true;
    }
    if (item.amount != null && typeof item.amount === "number") {
      // TODO:
    }
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { greaterThan, lessThan, items: newItems } = req.body;
    const filters = [
      greaterThan && `spentAt[greater_than]${greaterThan}`,
      lessThan && `spentAt[less_than]${lessThan}`,
    ]
      .filter(Boolean)
      .join("[and]");
    const { contents: spendingItems } = await client.get<{
      contents: SpendingItem[];
    }>({
      endpoint: "spending-items",
      queries: {
        limit: 9999,
        filters,
      },
    });

    await Promise.all([
      ...spendingItems.map((item) =>
        client.delete({
          endpoint: "spending-items",
          contentId: item.id,
        })
      ),
      ...newItems.map((item) =>
        client.create({
          endpoint: "spending-items",
          content: {
            amount: item.amount,
            comment: item.comment,
            spentAt: item.spentAt,
          },
        })
      ),
    ]);

    res.status(200).json();
  }

  res.status(404).send();
}
