# Troubleshooting - Formulario de Contacto

## Problema: "Error al enviar el mensaje"

### 1. Verificar que la función esté desplegada

```bash
# Desde el directorio raíz del proyecto
supabase functions deploy contact-form
```

### 2. Verificar variables de entorno en Supabase

Asegúrate de que las siguientes variables estén configuradas en tu proyecto Supabase:

```bash
# En Supabase Dashboard > Settings > Edge Functions
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_SENDER_EMAIL=tu-email@tudominio.com
ADMIN_EMAIL=contacto@tuparte.digital
```

### 3. Verificar configuración de Resend

1. **Verificar API Key**: Asegúrate de que tu API key de Resend sea válida
2. **Verificar dominio**: El email sender debe estar verificado en Resend
3. **Verificar límites**: Revisa que no hayas excedido los límites de envío

### 4. Probar la función manualmente

Usa el script de prueba incluido:

```bash
# Editar test-contact-form.js con tu URL de Supabase
node test-contact-form.js
```

### 5. Verificar logs de Supabase

En Supabase Dashboard > Edge Functions > contact-form > Logs

Busca errores como:
- Variables de entorno faltantes
- Errores de Resend API
- Problemas de CORS

### 6. Verificar configuración de CORS

La función debe tener los headers CORS correctos:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### 7. Verificar URL de Supabase

Asegúrate de que `VITE_SUPABASE_URL` esté configurada correctamente en tu aplicación:

```bash
# En tu archivo .env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
```

### 8. Errores comunes y soluciones

#### Error: "RESEND_API_KEY environment variable is not set"
- **Solución**: Configurar la variable en Supabase Dashboard

#### Error: "RESEND_SENDER_EMAIL environment variable is not set"
- **Solución**: Configurar el email sender verificado

#### Error: "Failed to fetch"
- **Solución**: Verificar conexión a internet y URL de Supabase

#### Error: "CORS error"
- **Solución**: Verificar que la función esté desplegada correctamente

### 9. Pasos de debugging

1. **Abrir consola del navegador** (F12)
2. **Enviar formulario** y revisar logs
3. **Verificar respuesta** del servidor
4. **Revisar logs de Supabase** Edge Functions

### 10. Contacto de soporte

Si el problema persiste, proporciona:
- Logs de la consola del navegador
- Logs de Supabase Edge Functions
- Configuración de variables de entorno (sin valores sensibles)
- URL de tu proyecto Supabase

## Comandos útiles

```bash
# Desplegar función
supabase functions deploy contact-form

# Ver logs en tiempo real
supabase functions logs contact-form --follow

# Listar funciones desplegadas
supabase functions list

# Verificar estado de Supabase
supabase status
``` 