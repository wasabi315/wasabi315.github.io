import * as React from "react";

const Comment: React.FCX = () => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const script = document.createElement(`script`);
    script.src = `https://utteranc.es/client.js`;
    script.async = true;
    script.setAttribute(`repo`, `wasabi315/wasabi315.github.io`);
    script.setAttribute(`issue-term`, `pathname`);
    script.setAttribute(`label`, `comment`);
    script.setAttribute(`theme`, `github-light`);
    script.setAttribute(`crossorigin`, `anonymous`);

    parentRef.current?.appendChild(script);
    return () => {
      parentRef.current?.removeChild(script);
    };
  }, []);

  return <div ref={parentRef} />;
};

export default Comment;
