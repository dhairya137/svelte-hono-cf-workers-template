import * as jose from 'jose';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Generate RSA key pair for JWT signing and verification
 * 
 * @returns Promise with RSA key pair
 */
export async function generateKeyPair() {
  // Generate RSA key pair
  const { publicKey, privateKey } = await jose.generateKeyPair('RS256');
  
  // Export keys as JWK
  const publicKeyJwk = await jose.exportJWK(publicKey);
  const privateKeyJwk = await jose.exportJWK(privateKey);
  
  // Return as strings
  return {
    publicKey: JSON.stringify(publicKeyJwk),
    privateKey: JSON.stringify(privateKeyJwk)
  };
}

/**
 * Create a JWT token for the user
 * 
 * @param user User object
 * @param privateKey Private key for signing
 * @returns JWT token
 */
export async function createJwt(user: { id: string; email: string }, privateKey: string) {
  // Parse private key from JWK
  const key = await jose.importJWK(JSON.parse(privateKey), 'RS256');
  
  // Create JWT with user information
  const jwt = await new jose.SignJWT({
    sub: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
    iss: 'svelte-hono-auth-app'
  })
    .setProtectedHeader({ alg: 'RS256' })
    .sign(key);
  
  return jwt;
}

/**
 * Verify a JWT token
 * 
 * @param token JWT token
 * @param publicKey Public key for verification
 * @returns Payload if valid, null if not
 */
export async function verifyJwt(token: string, publicKey: string) {
  try {
    // Parse public key from JWK
    const key = await jose.importJWK(JSON.parse(publicKey), 'RS256');
    
    // Verify token
    const { payload } = await jose.jwtVerify(token, key, {
      issuer: 'svelte-hono-auth-app',
      clockTolerance: 30 // 30 seconds tolerance for clock skew
    });
    
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}

/**
 * Authentication utilities
 */

/**
 * Hash a password
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Convert password to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Hash the password with SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compares a password with a stored hash
 * 
 * @param password Password to verify
 * @param storedHash Stored password hash
 * @returns Whether the password matches the hash
 */
export async function comparePassword(password: string, storedHash: string): Promise<boolean> {
  // Split salt and hash
  const [saltHex, hashBase64] = storedHash.split('.');
  
  if (!saltHex || !hashBase64) {
    return false;
  }
  
  // Convert salt from hex to Uint8Array
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );
  
  // Encode password
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Hash with the same salt
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...data])
  );
  
  // Convert hash to base64
  const computedHashBase64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  
  // Compare computed hash with stored hash
  return computedHashBase64 === hashBase64;
}

/**
 * Generate a CSRF token
 * 
 * @returns CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

/**
 * Validate password strength
 * 
 * @param password Password to validate
 * @returns True if password meets requirements
 */
export function isStrongPassword(password: string): boolean {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

/**
 * Validate email format
 * 
 * @param email Email to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
} 