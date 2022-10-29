import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../src/lib/microcms";
import { SpendingItem } from "../../src/utils/types";

type Data = {
  spendingItems: SpendingItem[];
} | void;

const fetcher = ({
  endpoint,
  greaterThan,
  lessThan,
}: {
  endpoint: string;
  greaterThan?: string;
  lessThan?: string;
}) => {
  const filters = [
    greaterThan && `spentAt[greater_than]${greaterThan}`,
    lessThan && `spentAt[less_than]${lessThan}`,
  ]
    .filter(Boolean)
    .join("[and]");

  return client
    .get<{ contents: SpendingItem[] }>({
      endpoint,
      queries: {
        limit: 9999,
        filters,
      },
    })
    .then((res) => res.contents);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { greaterThan, lessThan } = req.query;
    const spendingItems = await fetcher({
      endpoint: "spending-items",
      greaterThan: greaterThan?.toString(),
      lessThan: lessThan?.toString(),
    });
    res.status(200).json({ spendingItems });
  }

  res.status(404).send();
}
