const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// using try catch (we don't use this)
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// by shradhha ma'am (but we need a global middleware here)
// const asyncHandler = (fn) => {
//   return (req, res, next) => {
//     // fn(req, res, next).catch(next);
//     fn(req, res, next).catch((err) => next(err));
//   };
// };
