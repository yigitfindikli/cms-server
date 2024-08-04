import config from "config";
import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
	payload: Object,
	keyName: "accessToken" | "refreshToken",
	options: SignOptions
) => {
	const privateKey = Buffer.from(
		config.get<string>(keyName),
		"base64"
	).toString("ascii");

	return jwt.sign(payload, privateKey, {
		...(options && options)
	});
};

export const verifyJwt = <T>(
	token: string,
	keyName: "accessToken" | "refreshToken"
): T | null => {
	try {
		const publicKey = Buffer.from(
			config.get<string>(keyName),
			"base64"
		).toString("ascii");
		const decoded = jwt.verify(token, publicKey) as T;

		return decoded;
	} catch (error) {
		return null;
	}
};
