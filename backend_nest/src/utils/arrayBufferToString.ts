/**
 * Converts an ArrayBuffer to a String.
 *
 * @param buffer - Buffer to convert.
 * @returns String.
 */
export default function arrayBufferToString(buffer: ArrayBuffer): string {
  return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)));
}
