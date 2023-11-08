import axios from "axios";
import { getCookie } from "./cookies.utils";
import { PageTree, TreePage, flattenTree } from "./tree.utils";
import { clone } from "lodash-es";
import { ArrayElementType } from "../types/helper.types";
import { useEffect, useState } from "react";
import {
	getLocalStorageItem,
	removeLocalStorageItem,
	setLocalStorageItem,
} from "./localStorage.utils";
import { CourseIconAdvanced } from "../components/hub/university/CourseIconAdvanced";
import { CourseIconBeginner } from "../components/hub/university/CourseIconBeginner";
import { CourseIconIntermediate } from "../components/hub/university/CourseIconIntermediate";
import { BrandColorNameV4 } from "../styles/colorsV4.styles";
import { useSiteContext } from "../context/site.context";

const api = "https://hq.tines.io/webhook/api/university";

const getEmail = () => getCookie("email_address");

type UniProgress = {
	email: string;
	courses: {
		id: string;
		name: string;
		completed: boolean;
		progress: LessonProgress[];
	}[];
};

type LessonProgress = {
	id: string;
	slug: string;
	completionTime: string;
};

export type TreePageWithCompletionTime = TreePage & {
	completionTime: string;
};

export const getCurrentUserUniProgress = async () => {
	const email = getEmail();
	try {
		const progress = await axios.get<UniProgress>(
			`${api}/?email=${email}&action=get-all-course-progress-records`
		);
		return progress.data;
	} catch (e) {
		// eslint-disable-next-line no-console
		console.warn(e);
		return {
			email,
			courses: [],
		} as UniProgress;
	}
};

export const markLessonAsComplete = async (data: {
	course: {
		id: string;
		title: string;
	};
	lesson: {
		id: string;
		slug: string;
	};
}) => {
	const email = getEmail();
	try {
		const response = await axios.post<{ status: string }>(api, {
			...data,
			email,
			action: "mark-lesson-as-complete",
		});
		return response.data;
	} catch (e) {
		// eslint-disable-next-line no-console
		console.warn(e);
		return {
			status: "error",
		};
	}
};

export const markCourseAsComplete = async (data: {
	course: {
		id: string;
		title: string;
	};
}) => {
	const email = getEmail();
	try {
		const response = await axios.post<{ status: string }>(api, {
			...data,
			email,
			action: "mark-course-as-complete",
		});
		return response.data;
	} catch (e) {
		// eslint-disable-next-line no-console
		console.warn(e);
		return {
			status: "error",
		};
	}
};

export const mergeProgressIntoLearningPath = (
	_path: TreePage,
	pathProgress: LessonProgress[]
) => {
	const path = clone(_path);
	const children = (
		flattenTree(path.treeChildren) as TreePageWithCompletionTime[]
	).filter((c) => c.treeChildren.length === 0);
	pathProgress.forEach((p) => {
		const lesson = children.find(
			(c) => c.id === p.id
		) as TreePageWithCompletionTime | null;
		if (lesson) lesson.completionTime = p.completionTime;
	});
	return {
		path,
		children,
	};
};

export const mergeProgressIntoTree = (
	_tree: PageTree,
	uniProgress?: UniProgress
) => {
	const tree = clone(_tree);
	const updatedTree = tree.map((path) => {
		const courseProgress = uniProgress?.courses.find(
			(c) => c.id === path.id
		);
		return mergeProgressIntoLearningPath(
			path,
			courseProgress?.progress ?? []
		);
	});
	return updatedTree.map((path) => {
		return {
			tree: path,
			hasStarted: path.children.some((c) => !!c.completionTime),
			completed:
				uniProgress?.courses.find((c) => c.id === path.path.id)
					?.completed ??
				path.children.every((c) => !!c.completionTime),
		};
	});
};

export type TreeWithProgress = ReturnType<typeof mergeProgressIntoTree>;
export type LearningPathWithProgress = ArrayElementType<TreeWithProgress>;

export const getCachedUniTreeWithProgress = () => {
	if (getCookie("email_address") === getLocalStorageItem("uniStudentId")) {
		const cachedProgress =
			getLocalStorageItem<TreeWithProgress>("uniProgress");
		return cachedProgress;
	} else {
		removeLocalStorageItem("uniProgress");
		setLocalStorageItem("uniStudentId", getCookie("email_address"));
	}
	return null;
};

export const useUniTreeWithProgress = (tree: PageTree) => {
	const siteContext = useSiteContext();
	const [treeWithProgress, setTreeWithProgress] = useState<TreeWithProgress>(
		mergeProgressIntoTree(tree)
	);
	useEffect(() => {
		const cachedProgress = getCachedUniTreeWithProgress();
		if (cachedProgress) setTreeWithProgress(cachedProgress);
		(async () => {
			const progress = await getCurrentUserUniProgress();
			const treeWithProgress = mergeProgressIntoTree(tree, progress);
			setLocalStorageItem("uniProgress", treeWithProgress);
			setTreeWithProgress(treeWithProgress);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteContext.location.pathname]);
	return treeWithProgress;
};

export const KnownLearningPathConfigs: {
	id: string;
	slug: string;
	title: string;
	color: BrandColorNameV4;
	icon: React.FC;
}[] = [
	{
		id: "148079434",
		slug: "tines-basics",
		title: "Tines basics",
		icon: CourseIconBeginner,
		color: "green",
	},
	{
		id: "148079461",
		slug: "intermediate",
		title: "Intermediate",
		icon: CourseIconIntermediate,
		color: "orange",
	},
	{
		id: "148079482",
		slug: "advanced",
		title: "Advanced",
		icon: CourseIconAdvanced,
		color: "purple",
	},
];

export const getKnownLearningPathConfig = (id?: string) => {
	return KnownLearningPathConfigs.find((c) => c.id === id);
};
