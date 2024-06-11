export interface QuestionDef {
	id: string;
	isDiscussion: boolean;
	title: string;
	content?: string;
	tags: string[];
	likes: number;
	dislikes: number;
	opinion: "like" | "dislike" | "none";
	answers: number;
	created: string;
	updated: string;
	author: AuthorDef;
	isFavorite: boolean;
}

export interface AnswerDef {
	id: string;
	content: string;
	created: string;
	// likes: number;
	// dislikes: number;
	// opinion: "like" | "dislike" | "none";
	author: AuthorDef;
}

interface AuthorDef {
	id: string;
	name: string;
	type: "guest" | "user" | "pro" | "admin" | "ai";
}
