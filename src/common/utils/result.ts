export class Result<T> {
    success: boolean;
    value?: T;
    error?: string;
    status?: number;

    private constructor(success: boolean, value?: T, error?: string, status?: number) {
        this.success = success;
        this.value = value;
        this.error = error;
        this.status = status;
    }

    static ok<T>(value: T): Result<T> {
        return new Result(true, value);
    }

    static fail<T>(error: string, status?: number): Result<T> {
        return new Result(false, undefined, error, status);
    }
}
