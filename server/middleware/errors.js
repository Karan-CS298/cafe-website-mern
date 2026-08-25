export function notFound(req,res){res.status(404).json({message:'Resource not found'});}
export function errorHandler(err,req,res,next){console.error(err); if(res.headersSent)return next(err); const status=err.status|| (err.name==='ValidationError'?400:500); res.status(status).json({message:status===500?'Something went wrong. Please try again.':err.message});}
