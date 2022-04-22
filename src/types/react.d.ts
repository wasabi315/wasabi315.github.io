import * as React from "react";

declare module "react" {
  type FCX<P = {}> = React.FC<P & { className?: string }>;
}
