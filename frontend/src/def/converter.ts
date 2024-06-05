export const formatDate = (_date: string) => {
	let date = new Date(_date);
	
	const padToTwoDigits = (num: any) => num.toString().padStart(2, '0');
	
	const now = new Date();
	const hours = padToTwoDigits(date.getHours());
	const minutes = padToTwoDigits(date.getMinutes());
	const day = padToTwoDigits(date.getDate());
	const month = padToTwoDigits(date.getMonth() + 1);
	const year = date.getFullYear();
	const currentYear = now.getFullYear();
	
	const diff = now.getTime() - date.getTime();
	const diffInHours = diff / (1000 * 60 * 60);
	
	if (diffInHours < 24) {
		return `${ hours }:${ minutes }`;
	} else {
		if (year === currentYear) {
			return `${ day }.${ month }`;
		} else {
			return `${ day }.${ month }.${ year }`;
		}
	}
}
