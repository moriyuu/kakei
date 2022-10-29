import useSWR, { SWRConfig } from "swr";
import axios from "axios";

export const fetcher = async ({
  url,
  params,
}: {
  url: string;
  params?: Record<string, unknown>;
}) =>
  await axios
    .get(url, {
      baseURL: "http://localhost:3000/api",
      params,
    })
    .then((res) => res.data);
