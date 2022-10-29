import client from "../../lib/microcms";
import {
  SavedSpendingItem,
  SpendingItem,
  UnsavedSpendingItem,
} from "../../utils/types";

export const findSpendingItems = async (options: {
  moreRecentThanEqual: string;
  olderThan: string;
}): Promise<SavedSpendingItem[]> => {
  const filters = `spentAt[equals]${options.moreRecentThanEqual}[or](spentAt[greater_than]${options.moreRecentThanEqual}[and]spentAt[less_than]${options.olderThan})`;
  const spendingItems = await client
    .getList<SpendingItem>({
      endpoint: "spending-items",
      queries: {
        limit: 9999,
        filters,
      },
    })
    .then((res) => res.contents);
  return spendingItems;
};

export const saveSpendingItem = async (spendingItem: UnsavedSpendingItem) => {
  await client.create<SpendingItem>({
    endpoint: "spending-items",
    content: {
      amount: spendingItem.amount,
      comment: spendingItem.comment,
      spentAt: spendingItem.spentAt,
      order: spendingItem.order,
    },
  });
};

export const deleteSpendingItem = async (id: string) => {
  await client.delete({
    endpoint: "spending-items",
    contentId: id,
  });
};
