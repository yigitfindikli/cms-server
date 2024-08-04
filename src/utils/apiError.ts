import { Response, Request, NextFunction } from "express";

interface IApiError {
	name?: string;
	statusCode: number;
	message: string;
	isOperational?: boolean;
}
export default class ApiError extends Error {
	status: string;
	isOperational: boolean;
	statusCode: number;

	constructor({ name, statusCode, message }: IApiError) {
		super(message);

		this.statusCode = statusCode;
		this.name = name || "Error";
		this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

function handleApiError(
	error: ApiError,
	request: Request,
	res: Response,
	next: NextFunction
) {
	res.status(error.statusCode).send({
		status: error.status,
		message: error.message,
		name: error.name
	});
}

export { ApiError, handleApiError };
