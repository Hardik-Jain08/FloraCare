import { ReactNode } from "react";
import AccessingTheAPI from "../components/hub/api/AccessingTheAPI";
import LinkedHeading from "../components/utilities/LinkedHeading";
import { isBrowser } from "../environment";
import { getCookie } from "./cookies.utils";
import { simpleHtmlToText } from "./html.utils";

export const processAPIPageHtml = (
  input: string,
  shouldInterpolateDynamicTenantUrl: boolean
) => {
  let html = input;
  if (shouldInterpolateDynamicTenantUrl) {
    const dynamicTenantUrl = getDynamicTenantUrl();
    if (dynamicTenantUrl) {
      html = html.replace(
        /(&#x3C;|&lt;|<){2}META.tenant.domain(&#x3E;|&gt;|>){2}/g,
        dynamicTenantUrl
      );
    }
  }
  const lines = html.split("\n").filter(l => !/^<h1>/.test(l));
  const blocks = [] as ReactNode[];
  let block: string[] = [];
  const pushBlock = () => {
    if (blocks.length === 0) return;
    blocks.push(block.join("\n"));
    block = [];
  };
  lines.forEach(line => {
    switch (true) {
      case /<h[1-3]>/.test(line): {
        const contentMatch = line.match(/^<h([1-3])>(.*)<\/h[1-3]>$/);
        if (!contentMatch) return line;
        const level = parseInt(contentMatch[1]) as 1 | 2 | 3;
        const content = contentMatch[2];
        const plainText = simpleHtmlToText(content);
        pushBlock();
        blocks.push(
          <LinkedHeading level={level} plainText={plainText} html={content} />
        );
        break;
      }
      case /&lt;AccessingTheAPI \/&gt;/.test(line): {
        pushBlock();
        blocks.push(
          <AccessingTheAPI
            shouldInterpolateDynamicTenantUrl={
              shouldInterpolateDynamicTenantUrl
            }
          />
        );
        break;
      }
      default: {
        block.push(line);
      }
    }
  });
  pushBlock();
  return blocks;
};

export function getDynamicTenantUrl() {
  if (!isBrowser) return;
  return getCookie("last_used_tenant_domain")
    ?.replace(/^https:\/\//, "")
    .replace(/\/$/, "");
}
