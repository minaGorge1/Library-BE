

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
              return res.status(500).json({ message: "catch error", error, stack: error.stack }) 
            //return next(new Error("Catch Error", { cause: 500 })) // new Error bdor 3la a5r madil war aly hia al error handling
        })
    }
}

export const globalErrorHandling = (err, req, res, next) => { // 4 bramittier tb2a error handling 
    if (err) {
        return res.status(err.cause || 500).json({ message: err.message })
    }
}