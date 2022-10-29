import axios from "axios";
import { useMemo, useCallback } from "react";

export const useReplaceSpendingItems = () => {
  return useCallback(async () => {
    await axios.post("/replace-spending-items", {
      date,
      items,
    });
  }, []);
};
