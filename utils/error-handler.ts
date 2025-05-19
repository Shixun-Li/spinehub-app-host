import { ApiError } from 'openapi-typescript-fetch';

export function isAPIError(error: unknown): error is ApiError {
	return (
		typeof error === 'object' && error != null && 'data' in error && (error as any).status != null
	);
}
