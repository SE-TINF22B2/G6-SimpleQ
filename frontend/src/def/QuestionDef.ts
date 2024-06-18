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
	likes: number;
	dislikes: number;
	opinion: "like" | "dislike" | "none";
	author: AuthorDef;
}

interface AuthorDef {
	id: string;
	name: string;
	type: "guest" | "user" | "pro" | "admin" | "ai";
}

export function parseQuestion(_question: any): QuestionDef {
	return {
		answers: _question.numberOfAnswers ?? 0,
		author: {
			id: _question.author.id ?? "",
			name: _question.author.name ?? "Anonymous",
			type: _question.author.type ?? "guest"
		},
		created: _question.created ?? "0",
		dislikes: _question.dislikes ?? 0,
		id: _question.id,
		isDiscussion: _question.isDiscussion ?? false,
		likes: _question.likes ?? 0,
		opinion: _question.opinion ?? "none",
		tags: _question.tags ?? [],
		title: _question.title ?? "",
		updated: _question.updated ?? "0",
		isFavorite: _question.isFavorite ?? false
	}
}
