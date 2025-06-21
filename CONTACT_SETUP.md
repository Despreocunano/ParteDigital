# Configuración de la Página de Contacto

## Descripción

Se ha creado una página de contacto completa para la aplicación Parte Digital que incluye:

- Formulario de contacto con validación
- Información de contacto de la empresa
- Envío de emails automático usando Resend
- Confirmación por email al usuario
- Integración con Supabase Edge Functions
- Templates de email profesionales con branding

## Archivos Creados/Modificados

### Nuevos Archivos
- `src/pages/ContactPage.tsx` - Página principal de contacto
- `supabase/functions/contact-form/index.ts` - Función para procesar formularios
- `CONTACT_SETUP.md` - Este archivo de documentación

### Archivos Modificados
- `src/App.tsx` - Agregadas rutas para `/contact` y `/contacto`
- `src/components/dashboard/Sidebar.tsx` - Agregado enlace de contacto
- `src/components/dashboard/MobileNav.tsx` - Agregado enlace de contacto móvil

## Configuración Requerida

### 1. Variables de Entorno

Asegúrate de tener configuradas las siguientes variables de entorno en tu proyecto Supabase:

```bash
# En las variables de entorno de Supabase Edge Functions
RESEND_API_KEY=tu_api_key_de_resend
RESEND_SENDER_EMAIL=tu_email_verificado@tudominio.com
ADMIN_EMAIL=contacto@tuparte.digital
```

### 2. Configuración de Resend

1. Crea una cuenta en [Resend](https://resend.com)
2. Verifica tu dominio de email
3. Obtén tu API key
4. Configura las variables de entorno en Supabase

### 3. Despliegue de la Función

Para desplegar la función de contacto:

```bash
# Desde el directorio raíz del proyecto
supabase functions deploy contact-form
```

## Funcionalidades

### Formulario de Contacto
- **Campos requeridos**: Nombre, Email, Asunto, Mensaje
- **Validación**: Email válido, mensaje mínimo 10 caracteres
- **Feedback visual**: Errores en tiempo real, estados de carga

### Envío de Emails con Resend
- **Email al administrador**: Notificación con todos los detalles del mensaje
- **Email de confirmación**: Confirmación automática al usuario
- **Reply-to**: Configurado para responder directamente al usuario
- **Templates profesionales**: Diseño HTML con branding de Parte Digital

### Información de Contacto
- Email: contacto@tuparte.digital
- Teléfono: +56 9 1234 5678
- Ubicación: Santiago, Chile

## Rutas Disponibles

- **Panel**: `/contact` (requiere autenticación)
- **Sitio público**: `/contacto` (acceso público)

## Personalización

### Cambiar Información de Contacto

Edita el array `contactInfo` en `src/pages/ContactPage.tsx`:

```typescript
const contactInfo = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: 'Email',
    content: 'tu-email@tudominio.com',
    link: 'mailto:tu-email@tudominio.com'
  },
  // ... más información
];
```

### Personalizar Templates de Email

Los templates de email están en `supabase/functions/contact-form/index.ts`. Incluyen:

- **Logo de Parte Digital** en el header
- **Colores corporativos** (rosa #f43f5f)
- **Diseño responsive** y profesional
- **Información de contacto** clara
- **Branding consistente**

## Pruebas

Para probar la funcionalidad:

1. Navega a `/contact` o `/contacto`
2. Completa el formulario
3. Verifica que recibes:
   - Email de confirmación
   - Email de notificación al administrador (contacto@tuparte.digital)
4. Verifica que el formulario se resetea correctamente

## Troubleshooting

### Error: "RESEND_SENDER_EMAIL environment variable is not set"
- Verifica que la variable esté configurada en Supabase
- Asegúrate de que el email esté verificado en Resend

### Error: "Failed to send email"
- Verifica tu API key de Resend
- Asegúrate de que el dominio esté verificado
- Revisa los logs de Supabase Edge Functions

### El formulario no se envía
- Verifica la consola del navegador para errores
- Asegúrate de que la función esté desplegada correctamente
- Verifica que la URL de Supabase esté configurada

## Seguridad

- Validación de entrada en el frontend y backend
- Sanitización de datos antes del envío
- Rate limiting recomendado para producción
- CORS configurado correctamente

## Próximos Pasos

- Implementar rate limiting
- Agregar captcha para prevenir spam
- Integrar con sistema de tickets
- Agregar notificaciones push
- Implementar chat en vivo 