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
import { importPKCS8 } from 'jose';

// For local development, paste your PEM private key here
const LOCAL_PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnJ0LuAsBZymrr
ovPPWksDLXTZSlv+fRSxgIBuDgOtgugDQuhhAN/k52C8KgvjsFCuFD5Cf1e6icRb
BT9tZi3R7Dl9lEHmzLr8sOWZj9YqpLwtk2OOMV8pd51wwiM9ZxAwbYPDXV4WrzDr
m5mGm7DwEkrKYCcc/WjwzqL1NUAYr+Qp8Ke6Dw6vKvbCDMmtM3AuzL3Iz4ZAbzzw
j2XElt/O1nQD401zgGCLt6cnWwfzszuj2hU8oVMQumI0vSPtMvYKUCuQHVJUrNXG
+qIkAZn2PxebrjeMQKcJw/tGteAgAWCLVXJ7zY5aRpjZayX2IphqO17VQSggPMTe
heFoQtAVAgMBAAECggEABcAJguOQV2ZpuDJyXbM2+mSBbQosUPxfjl2jzWVpBfqH
XblbAh9EFH1LLB3sK8iAdgSXQbVcwLuFiDYNgQdvUxXjwmirvbNUSWYSd+5lSTFC
kfTMi3MyWVxWi676BF47xda2ni1jk7cyISDIrsNDWnbeoMie/9XN2t7Y50OOMWsp
UyOS8bfGOKr/VJHCtcl41+unKz8MjMZ2eH89hq+AokDyRgE8DspKM8FygFH3BpoF
CU1Dlja3SN8n6rSO1LSeisRg5vauEuXDhn9mj9KJ6B9G87vjWIIeDAfXcXO24ewx
SW85+Z5iPsk8DyuZHySetk/d4rjJzsodsMF4dc2XsQKBgQDd+dP+FXMPYTqCfbVO
CnXoKkH9r0v3YWEsK6j4D4B2+0aEed8Yi32hJ+cHTc9y1HjvNs+FDiIknr/+lfOq
+5FCyBErBRYQWyjqGDZCBOMixRRLLzwW6aJ2GQck+PSzPJ73fCcSUaks+16ykhxi
abLp2iXPE+jIIqUniHSv9iADaQKBgQDAxjzJvqT5hRmd0aUtOTspC3gPp0HV3EWB
0DsxBeAnG7bv8S0ic5Tx6i9o+XTyVutO8b92S2r4Nv7I7FhQqQWKOR1CIvMnrcui
+wZXd2SrsOQMS2uz7Bbjpv/HOZTaQ7lAvAD3NGCw81Gh/RWdXkAe30bges98e6Rk
LZFskx3NzQKBgFuV2IHdF7wgwaNVepjYeA1yYgfpa86FvzIaUX0H6FkvE8lU/1eB
NjRn4kqBMDaQs9T/KGAdlLjHRzAjboX9hdGn+m1li9Tzx83Ob5SNr6mI5vaeZoyN
mRpg+TGoBk5tlKlH8Fb+mm6UyF2lK1Dvi4IxH6hw7nqk0L+e7YYsZskBAoGAHROJ
hbCAt7YQuBIwBNM2DinRsSK8NmKkBUGAPBOzzJJMlIJfGWwvkhGNlxrRPeBIW77w
7wnPF6NL6MhlRb1IvaGBvUECRgDbzzhnq3exsofazdPuadP5W9sLh2QzBHzki1QQ
HTlEQExjCrjesr7NkxqAWUmM1CzeDdIltie2fh0CgYAqFUaUdzIaORP/cyGf6j40
7hQKpEkNMVB3kyGG+KHEPapRj4RzezzOEHrtLr5f3HEbDlZ2MQ+uPTBqud9ZJpiK
+jrNMTx/PgknByDNINcaFe/Kq9QQT8FgbGSlicFPufvDflikYEgl95Bu7tyGqeuS
j3MQtv5rtDKBy8wEg0gs/Q==
-----END PRIVATE KEY-----`;

export async function createJwt(user: { id: string; email: string }, privateKey: string = LOCAL_PRIVATE_KEY_PEM) {
  // Use PEM private key directly
  const key = await importPKCS8(privateKey, 'RS256');

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