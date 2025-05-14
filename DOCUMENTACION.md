
# Documentación del Sistema TranspoRegistrosPlus

## Introducción

TranspoRegistrosPlus es un sistema de gestión para empresas de transporte que permite administrar vehículos, viajes, gastos y generar reportes. El sistema incluye funcionalidades de registro de usuarios, autenticación, auditoría y permisos basados en roles.

## Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI Components
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Gráficos**: Recharts
- **Gestión de Estado**: React Query
- **Enrutamiento**: React Router
- **Notificaciones**: Sonner

## Estructura del Proyecto

### Componentes Principales

- **AppLayout**: Estructura principal de la aplicación que incluye la barra lateral y el contenido
- **AppSidebar**: Barra lateral con navegación dinámica basada en permisos
- **DatePickerWithRange**: Selector de fechas para filtrar datos
- **RolSelector**: Componente para seleccionar roles de usuario

### Páginas

- **Dashboard**: Resumen general con estadísticas clave
- **Vehículos**: Gestión de vehículos de la empresa
- **Viajes**: Planificación y seguimiento de viajes
- **Gastos**: Registro y gestión de gastos
- **Combustible**: Gestión específica de gastos de combustible
- **Peajes**: Gestión específica de gastos de peajes
- **Reportes**: Visualización de datos y generación de informes
- **Auditoria**: Registro de actividades del sistema
- **Configuración**: Ajustes generales del sistema
- **Login**: Pantalla de inicio de sesión
- **Registro**: Pantalla de registro de nuevos usuarios
- **RecuperarPassword**: Recuperación de contraseñas

### Servicios

- **auditoriaService**: Gestión de registros de auditoría
- **permisosService**: Gestión de permisos basados en roles

### Hooks Personalizados

- **useAuthProvider**: Gestión de autenticación y perfil de usuario
- **usePermisos**: Obtención de módulos permitidos según el rol

## Modelo de Datos

### Tablas Principales

1. **usuarios (auth.users)**: Usuarios del sistema
2. **perfiles**: Datos adicionales de usuarios
3. **empresas**: Empresas registradas
4. **roles**: Roles disponibles en el sistema
5. **usuarios_roles**: Relación entre usuarios y roles
6. **modulos**: Módulos del sistema
7. **permisos_rol**: Permisos de roles sobre módulos
8. **vehiculos**: Vehículos registrados
9. **viajes**: Viajes planificados o realizados
10. **gastos**: Gastos generados
11. **auditoria**: Registro de actividades

## Funcionalidades Principales

### Autenticación y Registro

El sistema permite a los usuarios registrarse con su correo electrónico, contraseña, nombre y seleccionar un rol. Durante el registro, los usuarios pueden:

- Crear una nueva empresa
- Unirse a una empresa existente
- Seleccionar su rol en el sistema

El componente RolSelector permite seleccionar roles desde la base de datos, asociando directamente al usuario con el rol seleccionado.

### Gestión de Roles y Permisos

Los permisos se asignan basados en roles, controlando el acceso a:

- Módulos visibles en la barra lateral
- Acciones permitidas: crear, ver, editar, eliminar
- Funcionalidades específicas

### Auditoría

El sistema registra automáticamente todas las acciones realizadas, incluyendo:

- Creación, edición y eliminación de registros
- Visualizaciones de datos
- Usuario que realizó la acción
- Fecha y hora
- Detalles de los cambios

### Reportes

El módulo de reportes permite:

- Filtrar datos por fecha y vehículo
- Visualizar gastos por tipo, vehículo y evolución temporal
- Exportar datos en formato CSV

## Guía de Uso

### Registro e Inicio de Sesión

1. Acceda a la pantalla de registro
2. Complete sus datos personales
3. Si es una nueva empresa, ingrese el nombre
4. Seleccione su rol
5. Complete su contraseña
6. Confirme su registro
7. Inicie sesión con sus credenciales

### Navegación

- Use la barra lateral para acceder a los diferentes módulos
- El dashboard muestra información resumida
- Cada módulo tiene opciones específicas de filtrado y acción

### Reportes

1. Acceda al módulo de reportes
2. Seleccione el rango de fechas deseado
3. Filtre por vehículo si desea información específica
4. Visualice los gráficos interactivos
5. Exporte los datos usando el botón "Exportar reporte"

## Implementación Técnica

### Autenticación

La autenticación se implementa mediante Supabase Auth con almacenamiento persistente de sesión. El hook useAuthProvider maneja:

- Inicio de sesión y registro
- Mantenimiento de sesión
- Carga de perfiles de usuario
- Asignación de roles

### Auditoría

El servicio auditoriaService gestiona:

- Obtención de registros de auditoría para administradores
- Obtención de los propios registros para usuarios
- Registro manual de visualizaciones

### Permisos

El hook usePermisos obtiene los módulos permitidos mediante:

- Consulta a la función PostgreSQL obtener_modulos_por_rol
- Verificación de permisos específicos con la función tiene_permiso

## Mantenimiento y Solución de Problemas

### Errores Comunes

- **Problemas de autenticación**: Verificar credenciales y confirmar estado de la cuenta
- **Errores de permisos**: Comprobar asignación correcta de roles
- **Datos no visibles**: Verificar filtros aplicados y permisos del usuario

### Actualizaciones

Al actualizar el sistema, tener en cuenta:

- Mantener compatibilidad con estructura de datos existente
- Actualizar políticas de RLS en Supabase
- Probar exhaustivamente cambios en autenticación

## Contacto y Soporte

Para soporte técnico o consultas sobre el sistema, contacte con:
- Correo: soporte@transporegistrosplus.com
- Sistema de tickets: https://soporte.transporegistrosplus.com
