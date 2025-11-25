export enum ResponseErrorType {
  NOT_FOUND = "Not Found",
  INVALID_INPUT = "Invalid Input",
  UNHANDLED = "Unhandled",
  TOO_MANY_REQUESTS = "Too Many Requests",
}

export type ResponseError = {type: ResponseErrorType; message?: string};

export async function withResponseError<T>(promise: Promise<T>): Promise<T> {
  return await promise.catch((error) => {
    // Check if it's a 404 error first (expected for non-existent transactions)
    const is404 =
      typeof error == "object" &&
      "status" in error &&
      (error as Response).status === 404;

    // Only log non-404 errors to avoid console spam for expected missing transactions
    if (!is404) {
      console.error("ERROR!", error, typeof error);
    }

    if (typeof error == "object" && "status" in error) {
      // This is a request!
      error = error as Response;
      if (error.status === 404) {
        throw {type: ResponseErrorType.NOT_FOUND};
      }
    }
    if (
      error.message
        .toLowerCase()
        .includes(ResponseErrorType.TOO_MANY_REQUESTS.toLowerCase())
    ) {
      throw {
        type: ResponseErrorType.TOO_MANY_REQUESTS,
      };
    }

    throw {
      type: ResponseErrorType.UNHANDLED,
      message: error.toString(),
    };
  });
}
