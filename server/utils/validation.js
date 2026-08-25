import {body, param, validationResult} from 'express-validator';
export const handleValidation=(req,res,next)=>{const errors=validationResult(req); if(!errors.isEmpty()) return res.status(400).json({message:'Validation failed',errors:errors.array()}); next();};
export const idParam=param('id').isMongoId().withMessage('Invalid id');
export const productRules=[body('name').trim().isLength({min:1,max:120}),body('description').optional().trim().isLength({max:500}),body('price').isFloat({min:0,max:100000}),body('category').isMongoId(),body('image').optional().isString().isLength({max:1000})];
export const categoryRules=[body('name').trim().isLength({min:1,max:80})];
