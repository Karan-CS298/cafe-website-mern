import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin, Category, Product, CafeSettings, Menu, Feature, About } from '../models/index.js';
import { slugify } from '../utils/slug.js';
import { saveUpload, removeUpload } from '../services/storage.js';

const safeAdmin = (a) => ({ id: a._id, email: a.email, role: a.role });
const publicUrl = (_req, urlPath) => urlPath;
const safeRemove = async (value, _req) => removeUpload(value);

export async function login(req, res) { const { email, password } = req.body; const a = await Admin.findOne({ email: String(email).toLowerCase().trim() }); if (!a || !(await bcrypt.compare(password, a.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' }); const token = jwt.sign({ id: a._id.toString(), email: a.email, role: a.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }); res.cookie('cafe_token', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', domain: process.env.COOKIE_DOMAIN || undefined, maxAge: 2 * 60 * 60 * 1000 }); res.json({ admin: safeAdmin(a) }); }
export function logout(req, res) { res.clearCookie('cafe_token', { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', domain: process.env.COOKIE_DOMAIN || undefined }); res.json({ message: 'Logged out' }); }
export async function me(req, res) { const a = await Admin.findById(req.admin.id).lean(); res.json({ admin: a ? safeAdmin(a) : null }); }

export async function listProducts(req, res) { res.json(await Product.find().populate('category', 'name slug').sort({ displayOrder: 1, name: 1 }).lean()); }
export async function createProduct(req, res) { const p = await Product.create({ ...req.body, price: Number(req.body.price) }); res.status(201).json(await p.populate('category', 'name slug')); }
export async function updateProduct(req, res) { const p = await Product.findByIdAndUpdate(req.params.id, { ...req.body, price: Number(req.body.price) }, { new: true, runValidators: true }).populate('category', 'name slug'); if (!p) return res.status(404).json({ message: 'Product not found' }); res.json(p); }
export async function deleteProduct(req, res) { const p = await Product.findByIdAndDelete(req.params.id); if (!p) return res.status(404).json({ message: 'Product not found' }); if (p.image) await safeRemove(p.image, req); res.json({ message: 'Product deleted' }); }

export async function listCategories(req, res) { res.json(await Category.find().sort({ displayOrder: 1, name: 1 }).lean()); }
export async function createCategory(req, res) { const c = await Category.create({ name: req.body.name, slug: slugify(req.body.name), displayOrder: Number(req.body.displayOrder || 0), isActive: req.body.isActive !== false }); res.status(201).json(c); }
export async function updateCategory(req, res) { const c = await Category.findByIdAndUpdate(req.params.id, { ...req.body, slug: req.body.name ? slugify(req.body.name) : undefined }, { new: true, runValidators: true }); if (!c) return res.status(404).json({ message: 'Category not found' }); res.json(c); }
export async function deleteCategory(req, res) { const inUse = await Product.exists({ category: req.params.id }); if (inUse) return res.status(409).json({ message: 'Category contains products. Reassign them before deleting.' }); const c = await Category.findByIdAndDelete(req.params.id); if (!c) return res.status(404).json({ message: 'Category not found' }); res.json({ message: 'Category deleted' }); }

export async function getSettings(req, res) { res.json(await CafeSettings.findOne().lean() || {}); }
export async function updateSettings(req, res) { const s = await CafeSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true }); res.json(s); }

export async function getMenu(req, res) { res.json(await Menu.findOne().sort({ uploadedAt: -1 }).lean() || {}); }
export async function uploadMenu(req, res) {
  if (!req.file || req.file.mimetype !== 'application/pdf') return res.status(400).json({ message: 'Only PDF files are allowed' });
  const current = await Menu.findOne().sort({ uploadedAt: -1 }).lean();
  const saved = await saveUpload(req.file, 'menu');
  const m = await Menu.findOneAndUpdate({}, { pdfUrl: publicUrl(req, saved.urlPath), fileName: req.file.originalname, uploadedAt: new Date() }, { new: true, upsert: true });
  if (current?.pdfUrl) await safeRemove(current.pdfUrl, req);
  res.status(201).json(m);
}
export async function deleteMenu(req, res) { const current = await Menu.findOne().lean(); await Menu.deleteMany({}); if (current?.pdfUrl) await safeRemove(current.pdfUrl, req); res.json({ message: 'Menu removed' }); }

export async function listFeatures(req, res) { res.json(await Feature.find().sort({ displayOrder: 1 }).lean()); }
export async function createFeature(req, res) { res.status(201).json(await Feature.create(req.body)); }
export async function updateFeature(req, res) { const f = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!f) return res.status(404).json({ message: 'Feature not found' }); res.json(f); }
export async function deleteFeature(req, res) { await Feature.findByIdAndDelete(req.params.id); res.json({ message: 'Feature deleted' }); }

export async function getAbout(req, res) { res.json(await About.findOne().lean() || {}); }
export async function updateAbout(req, res) { res.json(await About.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true })); }

export async function uploadAsset(req, res) {
  if (!req.file) return res.status(400).json({ message: 'File required' });
  const saved = await saveUpload(req.file, 'assets');
  const oldUrl = String(req.body.oldUrl || '');
  if (oldUrl) await safeRemove(oldUrl, req);
  res.json({ url: publicUrl(req, saved.urlPath), filename: saved.filename, mimetype: req.file.mimetype });
}
