import * as firebase from "../lib/firebase";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { useBoolean } from "../utils/useToggle";

type Props = {
  children: ReactElement;
};

export const Auth: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [isClient, toggleClient] = useBoolean(false);

  useEffect(() => toggleClient(true), [toggleClient]);

  const user = firebase.getCurrentUser();
  if (!user) {
    if (isClient) {
      router.replace("/signin");
    }
    return <div>loading (server)</div>;
  }

  return children;
};
