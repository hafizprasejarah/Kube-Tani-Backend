import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {

    try {
        const authorization = req.get('Authorization');

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                errors: 'Unauthorized'
            });
        }

        const token = authorization.substring(7)
        const user = verifyAccessToken(token);

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            errors: "Invalid or expired token"
        });
    }
}