export function whatsappUrl(number,message){const n=String(number||'').replace(/\D/g,'');return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;}
export function productOrderUrl(settings,p){return whatsappUrl(settings.whatsapp,`Hello! I want to order:\n\nCafe: ${settings.cafeName}\nItem: ${p.name}\nPrice: ₹${p.price}\n\nPlease confirm availability.`)}
