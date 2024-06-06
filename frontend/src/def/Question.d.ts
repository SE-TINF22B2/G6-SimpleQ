export interface Question {
	id: string;
	isDiscussion: boolean;
	title: string;
	content?: string;
	tags: string[];
	likes: number;
	dislikes: number;
	rating: "like" | "dislike" | "none";
	answers: number;
	created: string;
	updated: string;
	author: Author;
}

export interface Answer {
	id: string;
	content: string;
	created: string;
	likes: number;
	dislikes: number;
	rating: "like" | "dislike" | "none";
	author: Author;
}

interface Author {
	id: string;
	name: string;
	type: "guest" | "user" | "pro" | "admin" | "ai";
}
