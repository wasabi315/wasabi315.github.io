declare module "gatsby-awesome-pagination" {
  import type { Actions } from "gatsby";

  type PaginateArgs<TCtx> = {
    createPage: Actions[`createPage`];
    items: unknown[];
    itemsPerPage: number;
    itemsPerFirstPage?: number;
    pathPrefix: string;
    component: string;
    context?: TCtx;
  };

  export const paginate: <TCtx>(args: PaginateArgs<TCtx>) => void;

  export type PaginationContext = {
    humanPageNumber: number;
    pageNumber: number;
    numberOfPages: number;
    previousPagePath: string;
    nextPagePath: string;
  };
}
