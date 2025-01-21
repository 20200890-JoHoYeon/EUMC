/**
 * Converts a String to an ArrayBuffer.
 *
 * @param str - String to convert.
 * @returns ArrayBuffer.
 */
export default function stringToArrayBuffer(str: string): ArrayBufferView {
  const stringLength = str.length;
  const buffer = new ArrayBuffer(stringLength * 2);
  const bufferView = new Uint16Array(buffer);
  for (let i = 0; i < stringLength; i++) {
    bufferView[i] = str.charCodeAt(i);
  }
  return bufferView;
}
