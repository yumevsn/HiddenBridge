const ENCRYPTION_KEY = 'hiddenbridge_secret_key'; // In a real app, this should be an environment variable

export function encrypt(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Base64 encode the result
}

export function decrypt(encryptedText: string): string {
  const text = atob(encryptedText); // Base64 decode the input
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

