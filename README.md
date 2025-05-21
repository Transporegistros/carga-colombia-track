# TranspoRegistrosPlus

Sistema de gestión para empresas de transporte, permite administrar vehículos, viajes, gastos y reportes.

## Tecnologías

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Supabase (PostgreSQL, Auth)
- **Estado:** React Query

## Instalación

1. Clona el repositorio:
   ```sh
   git clone <YOUR_GIT_URL>
   ```
2. Entra al directorio:
   ```sh
   cd carga-colombia-track
   ```
3. Copia el archivo de ejemplo de variables de entorno:
   ```sh
   cp .env.example .env
   ```
   Modifica `.env` con tus datos de [Supabase](https://app.supabase.com).
4. Instala dependencias:
   ```sh
   npm install
   ```
5. Inicia el servidor de desarrollo:
   ```sh
   npm run dev
   ```

## Variables de entorno

Debes definir:

```
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

## Solución de problemas

- **Errores de autenticación:** Verifica tus variables de entorno y que Supabase esté correctamente configurado.
- **Problemas de permisos:** Revisa las policies de Supabase y los roles asignados.
- **Datos no visibles:** Asegúrate de tener los permisos y filtros correctos.

## Despliegue

Se recomienda Vercel, Netlify o similar, configurando las mismas variables de entorno.

## Testing

_(Por implementar)_ Se recomienda añadir pruebas con Vitest o Jest.

---

¿Problemas? Abre un issue o escribe a soporte@transporegistrosplus.com.
