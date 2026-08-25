import {CafeSettings,Category,Product,Menu,Feature,About} from '../models/index.js';
export async function cafe(req,res){res.json({settings:await CafeSettings.findOne().lean()||{}})}
export async function categories(req,res){res.json(await Category.find({isActive:true}).sort({displayOrder:1,name:1}).lean())}
export async function products(req,res){const q={isAvailable:true}; if(req.query.category)q.category=req.query.category; const data=await Product.find(q).populate('category','name slug').sort({displayOrder:1,name:1}).lean(); res.json(data)}
export async function best(req,res){res.json(await Product.find({isAvailable:true,isBestSeller:true}).populate('category','name slug').sort({displayOrder:1,name:1}).lean())}
export async function menu(req,res){res.json(await Menu.findOne().sort({uploadedAt:-1}).lean()||{})}
export async function features(req,res){res.json(await Feature.find({isActive:true}).sort({displayOrder:1}).lean())}
export async function about(req,res){res.json(await About.findOne().lean()||{})}
