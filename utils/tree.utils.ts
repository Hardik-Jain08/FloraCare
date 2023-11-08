import { ReactNode } from "react";

export type TreeBreadcrumbLevel = {
  title: string;
  shortTitle?: string;
  titleNode?: ReactNode;
  path: string;
};

export type TreePage = {
  id: string;
  title: string;
  shortTitle?: string;
  slug: string;
  path: string;
  position: number;
  hasNoContent?: boolean;
  treeParent?: {
    id: string;
  };
  treeChildren: TreePage[];
};

export type PageTree = TreePage[];

export const flattenTree = (tree: PageTree): TreePage[] => {
  return tree.reduce(
    (array, page) => [...array, page, ...flattenTree(page.treeChildren)],
    [] as TreePage[]
  );
};

export const getBreadcrumbsFromTree = (
  pathname: string,
  topLevel?: TreeBreadcrumbLevel | undefined,
  tree: PageTree = []
) => {
  const flattenedTree = flattenTree(tree);
  const page = flattenedTree.find(
    p => p.path.replace(/\/$/, "") === pathname.replace(/\/$/, "")
  );
  if (!page) return [];
  const levels: TreeBreadcrumbLevel[] = [];
  let nextParent: TreePage | TreePage["treeParent"] = page;
  while (nextParent) {
    const parentPage = flattenedTree.find(p => p.id === nextParent?.id);
    if (parentPage) levels.push(parentPage);
    nextParent = parentPage?.treeParent;
  }
  if (topLevel) levels.push(topLevel);
  return levels.reverse();
};
