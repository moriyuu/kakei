import { useCallback, useState } from "react";

export const useBoolean = (
  initial: boolean
): [boolean, (value?: boolean) => void] => {
  const [boolean, setBoolean] = useState<boolean>(initial);
  const toggle = useCallback(
    (value?: boolean) => setBoolean((_state) => value ?? !_state),
    []
  );

  return [boolean, toggle];
};
