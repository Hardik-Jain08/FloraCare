import axios from "axios";
import { StoryDescriptor } from "../types/helper.types";
import { DatoCmsLibraryTool } from "../../graphql-types";
import { readMarketingAttribution } from "./marketingAttribution.utils";
import { getCookie } from "./cookies.utils";
import { detectTouchSupport } from "./touch.utils";
import { guessBrowserTimezone } from "./time.utils";
import { isMobile } from "./browser.utils";
import { useState } from "react";
import { useOnMount } from "./lifeCycle.utils";

export enum CollectionType {
  "topLevel" = "Top-level",
  "team" = "Team",
  "useCase" = "Use case",
}

export const getStoryMetaById = async (id: string) => {
  try {
    const { data: story } = await axios.get<StoryDescriptor>(
      `/api/library/stories/${id}`
    );
    return story ?? null;
  } catch (e) {
    return null;
  }
};

export type DatoCmsLibraryToolWithComputedProperties = DatoCmsLibraryTool & {
  name: string;
  ranking: number;
  numberOfStories: number;
};

const reportStoryViewWebhook =
  "https://hq.tines.io/webhook/1189e7e1f9156384b41516ab41efced3/c6d359e2f9b092c6b4b41945636f454c";

export const reportStoryView = (story: StoryDescriptor) => {
  fetch(reportStoryViewWebhook, {
    method: "post",
    body: JSON.stringify({
      email: getCookie("email_address") ?? "",
      story: {
        id: story.id,
        name: story.name,
        slug: story.slug,
      },
      platform: window.navigator.platform,
      windowWidth: window.innerWidth,
      pageDisplayedAsMobile: window.innerWidth < 640,
      isLikelyMobileDevice: isMobile(),
      likelyHasTouchSupport: detectTouchSupport(),
      timezone: guessBrowserTimezone(),
      marketingAttributions: readMarketingAttribution(),
    }),
  });
};

export type StoryRankingDescriptor = {
  slug: string;
  id: number;
  rank: number;
  score: number;
};

const cachedRankings: StoryRankingDescriptor[] = [];

export const getStoryRankings = async () => {
  if (cachedRankings.length > 0) return cachedRankings;
  const rankings = (
    await axios.get<StoryRankingDescriptor[]>("/api/library/rankings")
  ).data;
  cachedRankings.push(...rankings);
  return rankings;
};

const cachedStoriesMap: Record<string, StoryDescriptor[]> = {};

export const useRankedStories = (o?: {
  collectionId?: string;
  toolSlug?: string;
}) => {
  const { collectionId, toolSlug } = o ?? {};
  const [stories, setStories] = useState<StoryDescriptor[]>([]);
  const [awaitingData, setAwaitingData] = useState(false);
  const [error, setError] = useState("");
  useOnMount(() => {
    (async function () {
      try {
        setAwaitingData(true);
        const rankings = await getStoryRankings();
        const cacheKey = o?.collectionId ?? o?.toolSlug ?? "all";
        const cachedStories = cachedStoriesMap[cacheKey];
        if (cachedStories) {
          setStories(cachedStories);
        } else {
          const { data: stories } = await axios.get<StoryDescriptor[]>(
            `/api/library/${
              collectionId
                ? `collections/${collectionId}/stories`
                : toolSlug
                ? `tools/${toolSlug}/stories`
                : "stories"
            }`
          );
          const rankedStories = stories.map(story => ({
            ...story,
            ranking: rankings.find(r => `${r.id}` === story.id)?.rank ?? 10,
          }));
          setStories(rankedStories);
          cachedStoriesMap[cacheKey] = [...rankedStories];
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError("Failed to fetch stories");
      } finally {
        setAwaitingData(false);
      }
    })();
  });
  return {
    awaitingStoriesData: awaitingData,
    stories,
    error,
  };
};

const intersection = <T>(A: T[], B: T[]) => A.filter(a => B.includes(a));
const uniq = <T>(A: T[]) => Array.from(new Set(A));

export const findStoriesOfTool = (
  tool: DatoCmsLibraryTool,
  allStories: StoryDescriptor[]
) => {
  return allStories.filter(
    story =>
      intersection(
        story.tags.map(t => t.trim().toLowerCase()).filter(i => i),
        uniq(
          [tool.name, ...(tool.tags ?? "").split(/\n/)]
            .map(i => i!.trim().toLowerCase())
            .filter(i => i)
        )
      ).length > 0
  );
};

export const addComputedPropertiesToTools = (
  tools: DatoCmsLibraryTool[],
  stories: StoryDescriptor[]
) => {
  if ("ranking" in (tools[0] ?? {}))
    return tools as DatoCmsLibraryToolWithComputedProperties[];
  const toolsWithNumberOfStories = tools.map(t => ({
    ...t,
    numberOfStories: findStoriesOfTool(t, stories).length,
  }));
  const toolsWithComputedProperties = toolsWithNumberOfStories
    .sort((a, b) => b.numberOfStories - a.numberOfStories)
    .map((t, i) => ({
      ...t,
      ranking: i + 1,
    }));
  return toolsWithComputedProperties as DatoCmsLibraryToolWithComputedProperties[];
};

const cachedTools: DatoCmsLibraryTool[] = [];

export const useAllLibraryTools = (allStories: StoryDescriptor[] = []) => {
  const [awaitingData, setAwaitingData] = useState(false);
  const [tools, setTools] = useState<DatoCmsLibraryTool[]>([]);
  const [error, setError] = useState("");
  useOnMount(() => {
    (async function () {
      try {
        setAwaitingData(true);
        if (cachedTools.length > 0) setTools(cachedTools);
        else {
          const { data } = await axios.get<DatoCmsLibraryTool[]>(
            `/api/library/tools`
          );
          setTools(data);
          cachedTools.push(...data);
        }
      } catch (e) {
        setError("Failed to fetch tools");
      } finally {
        setAwaitingData(false);
      }
    })();
  });

  return {
    awaitingToolsData: awaitingData,
    tools: addComputedPropertiesToTools(tools, allStories),
    error,
  };
};

export const useRankedStoriesAndTools = (o?: {
  collectionId?: string;
  toolSlug?: string;
}) => {
  const {
    awaitingStoriesData,
    stories,
    error: errorWhenGettingStories,
  } = useRankedStories({
    collectionId: o?.collectionId,
    toolSlug: o?.toolSlug,
  });
  const {
    awaitingToolsData,
    tools,
    error: errorWhenGettingTools,
  } = useAllLibraryTools(stories);
  return {
    awaitingData: awaitingStoriesData || awaitingToolsData,
    error: errorWhenGettingStories || errorWhenGettingTools,
    stories,
    tools,
  };
};
