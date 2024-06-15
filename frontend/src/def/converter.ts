export const formatDate = (_date: string) => {
	let date = new Date(_date);
	
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const diffInHours = diff / (1000 * 60 * 60);
	
	if (diffInHours < 24)
		return date.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit'
		});
	
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
