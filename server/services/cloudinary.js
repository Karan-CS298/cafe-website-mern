import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
export async function uploadBuffer(file,folder,resourceType='image'){if(!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('Cloudinary is not configured'); return new Promise((resolve,reject)=>{const stream=cloudinary.uploader.upload_stream({folder,resource_type:resourceType},(error,result)=>error?reject(error):resolve(result)); stream.end(file.buffer);});}
export async function deleteAsset(publicId,resourceType='image'){if(!publicId||!process.env.CLOUDINARY_CLOUD_NAME)return; await cloudinary.uploader.destroy(publicId,{resource_type:resourceType});}
