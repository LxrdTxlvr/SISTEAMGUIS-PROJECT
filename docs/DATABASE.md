# 📊 Esquema de Base de Datos - Sisteamguis

## Tablas Principales

### 1. tianguis
Información del tianguis

```sql
- id (UUID) - PK
- nombre (VARCHAR) - Nombre del tianguis
- calle (VARCHAR) - Calle donde se ubica
- latitud (DECIMAL) - Coordenada
- longitud (DECIMAL) - Coordenada
- total_puestos (INT) - Total de puestos (80)
- descripcion (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2. puestos
80 cubículos del tianguis

```sql
- id (UUID) - PK
- tianguis_id (UUID) - FK
- numero (INT) - Número del puesto (1-80)
- latitud (DECIMAL)
- longitud (DECIMAL)
- estado (VARCHAR) - 'libre' o 'ocupado'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3. clientes
Vendedores registrados

```sql
- id (UUID) - PK
- nombre (VARCHAR)
- telefono (VARCHAR)
- email (VARCHAR)
- categoria (VARCHAR)
- nombre_puesto (VARCHAR)
- descripcion_negocio (TEXT)
- activo (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 4. asignaciones
Relación cliente-puesto-fecha

```sql
- id (UUID) - PK
- puesto_id (UUID) - FK
- cliente_id (UUID) - FK
- tianguis_id (UUID) - FK
- fecha_asignacion (DATE)
- estado_pago (VARCHAR)
- monto_pago (DECIMAL)
- admin_asignado (UUID)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 5. cambios_offline
Cola de sincronización

```sql
- id (UUID) - PK
- user_id (UUID) - FK
- tipo_cambio (VARCHAR)
- tabla_afectada (VARCHAR)
- datos_cambio (JSONB)
- sincronizado (BOOLEAN)
- created_at (TIMESTAMP)
```

### 6. ubicaciones_admin
Geolocalización en tiempo real

```sql
- id (UUID) - PK
- user_id (UUID) - FK
- tianguis_id (UUID) - FK
- latitud (DECIMAL)
- longitud (DECIMAL)
- accuracy (INT)
- timestamp (TIMESTAMP)
- created_at (TIMESTAMP)
```

### 7. auditorias
Log de acciones

```sql
- id (UUID) - PK
- user_id (UUID) - FK
- accion (VARCHAR)
- tabla (VARCHAR)
- registro_id (UUID)
- datos_anteriores (JSONB)
- datos_nuevos (JSONB)
- created_at (TIMESTAMP)
```

## Índices

- Índice en puestos por tianguis
- Índice en puestos por estado
- Índice en asignaciones por puesto
- Índice en asignaciones por fecha
- Índice geoespacial en puestos

## Row-Level Security (RLS)

- Solo usuarios autenticados pueden acceder
- Admins ven todos los datos
- Usuarios normales solo ven sus propios datos

## Vistas Útiles

- `vista_ocupacion_tianguis` - Porcentaje de ocupación
- `vista_asignaciones_activas` - Asignaciones de hoy
- `vista_clientes_activos` - Clientes activos

## Ejecutar Schema

```sql
-- En Supabase SQL Editor
-- Copiar y pegar el contenido de backend/sisteamguis-schema.sql
-- Ejecutar
```

Para más detalles, ver `backend/sisteamguis-schema.sql`
