export async function hash_pass(msg) {
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);
  
    const buffer = await crypto.subtle.digest('SHA-256', data);
  
    const hashArray = Array.from(new Uint8Array(buffer));
  
    const hex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    return hex;
  }
  