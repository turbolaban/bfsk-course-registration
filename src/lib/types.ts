export interface RegistrationData {
	courseId: number;
	givenName: string;
	familyName: string;
	email: string;
	phone: string;
	isStudent?: boolean;
	paymentType: 'deposit' | 'full';
}
