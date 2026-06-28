import { ResponseError } from "../error/response_error.js";

const errorMiddleware = async (err, req, res, next) => {
    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            errors: err.message
        })

    } else {
        console.error(err)

        return res.status(500).json({
            errors: "Internal Server Error"
        })
    }
}

export {
    errorMiddleware
}