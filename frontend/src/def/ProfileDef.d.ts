export interface ProfileDef {
	id: string;
	name: string;
	type: "guest" | "user" | "pro" | "admin";
	registrationDate: string;
}
