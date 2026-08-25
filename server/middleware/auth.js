import jwt from 'jsonwebtoken';
export function requireAuth(req,res,next){try{const token=req.cookies?.cafe_token;if(!token) return res.status(401).json({message:'Authentication required'}); const payload=jwt.verify(token,process.env.JWT_SECRET); req.admin=payload; next();}catch{return res.status(401).json({message:'Session expired or invalid'})}}
export function requireRole(...roles){return (req,res,next)=>roles.includes(req.admin?.role)?next():res.status(403).json({message:'Insufficient permissions'});}
