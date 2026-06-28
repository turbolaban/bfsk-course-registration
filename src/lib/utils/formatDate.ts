export function formatDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;

	return new Intl.DateTimeFormat('no-NB', {
		dateStyle: 'medium' // Options: 'short', 'medium', 'long', 'full'
	}).format(d);
}
