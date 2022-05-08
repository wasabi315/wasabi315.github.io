import * as React from "react";

export const useFlag = (init: boolean) => {
  const [flag, setFlag] = React.useState(init);

  const set = React.useCallback(() => setFlag(true), []);
  const clear = React.useCallback(() => setFlag(false), []);
  const toggle = React.useCallback(() => setFlag((flag) => !flag), []);

  return { flag, set, clear, toggle };
};
