import { object, string, TypeOf, z } from "zod";

export const registerUserSchema = object({
	body: object({
		firstName: string({
			required_error: "First name is required"
		}),
		lastName: string({
			required_error: "Last name is required"
		}),
		email: string({
			required_error: "Email address is required"
		}).email("Invalid email address"),
		password: string({
			required_error: "Password is required"
		}).min(8, "Password must be more than 8 characters")
	})
});

export const loginUserSchema = object({
	body: object({
		email: string({
			required_error: "Email address is required"
		}).email("Invalid email address"),
		password: string({
			required_error: "Password is required"
		}).min(8, "Invalid email or password")
	})
});

export type RegisterUserInput = TypeOf<typeof registerUserSchema>["body"];

export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
