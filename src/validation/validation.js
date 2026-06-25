import { ResponseError } from "../error/response_error.js";

const validate = (schema, request) => {
    const result = schema.safeParse(request);
   
    if (!result.success) {
        throw new ResponseError(400, result.error.message);
    }
    return result.data;

};

export { validate };