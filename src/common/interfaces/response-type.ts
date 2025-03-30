export interface ResponseType<T> {
    data: T | null;
    error: string;
}