export const authErrorMessages: { [key: string]: string } = {
  'User already registered': 'El usuario ya está registrado',
  'Invalid login credentials': 'Credenciales de inicio de sesión inválidas',
  'Email not confirmed': 'El correo electrónico no ha sido confirmado',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Invalid email': 'Correo electrónico inválido',
  'Email rate limit exceeded': 'Límite de intentos de correo electrónico excedido',
  'Password is too weak': 'La contraseña es demasiado débil',
  'Email is already taken': 'El correo electrónico ya está en uso',
  'Invalid password': 'Contraseña inválida',
  'User not found': 'Usuario no encontrado',
  'Email not found': 'Correo electrónico no encontrado',
  'Invalid token': 'Token inválido',
  'Token expired': 'Token expirado',
  'Invalid refresh token': 'Token de actualización inválido',
  'Invalid OAuth state': 'Estado de OAuth inválido',
  'Invalid OAuth code': 'Código de OAuth inválido',
  'Invalid OAuth provider': 'Proveedor de OAuth inválido',
  'Invalid OAuth access token': 'Token de acceso de OAuth inválido',
  'Invalid OAuth refresh token': 'Token de actualización de OAuth inválido',
  'Invalid OAuth ID token': 'Token de ID de OAuth inválido',
  'Invalid OAuth user info': 'Información de usuario de OAuth inválida',
  'Invalid OAuth scope': 'Alcance de OAuth inválido',
  'Invalid OAuth redirect URI': 'URI de redirección de OAuth inválida',
  'Invalid OAuth client ID': 'ID de cliente de OAuth inválido',
  'Invalid OAuth client secret': 'Secreto de cliente de OAuth inválido',
  'Invalid OAuth grant type': 'Tipo de concesión de OAuth inválido',
  'Invalid OAuth response type': 'Tipo de respuesta de OAuth inválido',
  'Invalid OAuth response mode': 'Modo de respuesta de OAuth inválido',
  'Invalid OAuth nonce': 'Nonce de OAuth inválido',
  'Invalid OAuth code verifier': 'Verificador de código de OAuth inválido',
  'Invalid OAuth code challenge': 'Desafío de código de OAuth inválido',
  'Invalid OAuth code challenge method': 'Método de desafío de código de OAuth inválido',
  'Invalid OAuth PKCE': 'PKCE de OAuth inválido',
  'Invalid OAuth PKCE method': 'Método de PKCE de OAuth inválido',
  'Invalid OAuth PKCE verifier': 'Verificador de PKCE de OAuth inválido',
  'Invalid OAuth PKCE challenge': 'Desafío de PKCE de OAuth inválido',
  'Invalid OAuth PKCE challenge method': 'Método de desafío de PKCE de OAuth inválido',
};

export function translateAuthError(error: Error | null): string {
  if (!error) return 'Ha ocurrido un error inesperado';
  
  const message = error.message;
  return authErrorMessages[message] || message;
} 