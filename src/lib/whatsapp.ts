/**
 * Configuración y utilidades de WhatsApp para Cloto Colombia.
 * Lee la variable de entorno NEXT_PUBLIC_WHATSAPP_NUMBER para permitir
 * modificar el número fácilmente desde .env o el panel de hosting sin tocar código.
 */

export const DEFAULT_WHATSAPP_NUMBER = "573100000000";

/**
 * Obtiene el número oficial de WhatsApp para soporte y ventas de Cloto.
 * Sanitiza cualquier formato (espacios, guiones, símbolos +) y asegura
 * el prefijo de país colombiano (57) en caso de que solo se ingresen los 10 dígitos locales.
 */
export function getWhatsAppNumber(): string {
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!envNumber) return DEFAULT_WHATSAPP_NUMBER;

  const digits = envNumber.replace(/\D/g, "");
  if (!digits) return DEFAULT_WHATSAPP_NUMBER;

  // Si se ingresó un número móvil colombiano de 10 dígitos sin el 57 (ej: 3101234567)
  if (digits.length === 10 && digits.startsWith("3")) {
    return `57${digits}`;
  }

  return digits;
}

/**
 * Genera una URL de wa.me lista para usarse, opcionalmente con mensaje predeterminado codificado.
 */
export function getWhatsAppLink(message?: string): string {
  const number = getWhatsAppNumber();
  if (!message) {
    return `https://wa.me/${number}`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
