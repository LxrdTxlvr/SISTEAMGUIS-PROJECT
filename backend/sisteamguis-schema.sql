-- ============================================
-- EXTENSIONES (Necesarias para funciones geoespaciales)
-- ============================================

CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance; 
-- Opcional, pero recomendado para funcionalidades geoespaciales más amplias:
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- SISTEAMGUIS DATABASE SCHEMA
-- Base de datos para Sistema de Gestión de Tianguis
-- ============================================

-- ============================================
-- 1. TABLA: TIANGUIS (Información del Tianguis)
-- ============================================
CREATE TABLE IF NOT EXISTS tianguis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    calle VARCHAR(255) NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    total_puestos INT DEFAULT 80,
    descripcion TEXT,
    telefono_admin VARCHAR(20),
    email_admin VARCHAR(255),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. TABLA: PUESTOS (80 Bloques/Cubículos)
-- ============================================
CREATE TABLE IF NOT EXISTS puestos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tianguis_id UUID NOT NULL REFERENCES tianguis(id) ON DELETE CASCADE,
    numero INT NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    estado VARCHAR(50) DEFAULT 'libre', -- 'libre' | 'ocupado'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tianguis_id, numero)
);

-- ============================================
-- 3. TABLA: CLIENTES (Vendedores del Tianguis)
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    categoria VARCHAR(100), -- 'comida', 'ropa', 'artesanías', etc.
    nombre_puesto VARCHAR(255),
    descripcion_negocio TEXT,
    documento_identidad VARCHAR(50),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. TABLA: ASIGNACIONES (Relación Cliente-Puesto)
-- ============================================
CREATE TABLE IF NOT EXISTS asignaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    puesto_id UUID NOT NULL REFERENCES puestos(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE SET NULL,
    tianguis_id UUID NOT NULL REFERENCES tianguis(id) ON DELETE CASCADE,
    fecha_asignacion DATE NOT NULL,
    estado_pago VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente' | 'pagado'
    monto_pago DECIMAL(10, 2),
    notas TEXT,
    admin_asignado UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tianguis_id, puesto_id, fecha_asignacion)
);

-- ============================================
-- 5. TABLA: CAMBIOS_OFFLINE (Queue de Cambios Locales)
-- ============================================
CREATE TABLE IF NOT EXISTS cambios_offline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    tipo_cambio VARCHAR(50) NOT NULL, -- 'crear', 'actualizar', 'eliminar'
    tabla_afectada VARCHAR(50) NOT NULL, -- 'asignaciones', 'puestos', 'clientes'
    datos_cambio JSONB NOT NULL,
    sincronizado BOOLEAN DEFAULT false,
    fecha_cambio TIMESTAMP DEFAULT NOW(),
    fecha_sincronizacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. TABLA: UBICACIONES_ADMIN (Geolocalización en Tiempo Real)
-- ============================================
CREATE TABLE IF NOT EXISTS ubicaciones_admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    tianguis_id UUID NOT NULL REFERENCES tianguis(id),
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    accuracy INT, -- precisión en metros
    velocidad DECIMAL(5, 2),
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. TABLA: AUDITORÍA (Log de Acciones)
-- ============================================
CREATE TABLE IF NOT EXISTS auditorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    accion VARCHAR(100) NOT NULL,
    tabla VARCHAR(50) NOT NULL,
    registro_id UUID,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES (Optimización de Consultas)
-- ============================================

-- Índices en PUESTOS
CREATE INDEX idx_puestos_tianguis ON puestos(tianguis_id);
CREATE INDEX idx_puestos_estado ON puestos(estado);
CREATE INDEX idx_puestos_ubicacion ON puestos USING GIST (ll_to_earth(latitud, longitud)); -- para búsquedas geoespaciales

-- Índices en ASIGNACIONES
CREATE INDEX idx_asignaciones_puesto ON asignaciones(puesto_id);
CREATE INDEX idx_asignaciones_cliente ON asignaciones(cliente_id);
CREATE INDEX idx_asignaciones_tianguis ON asignaciones(tianguis_id);
CREATE INDEX idx_asignaciones_fecha ON asignaciones(fecha_asignacion);
CREATE INDEX idx_asignaciones_estado_pago ON asignaciones(estado_pago);

-- Índices en CLIENTES
CREATE INDEX idx_clientes_categoria ON clientes(categoria);
CREATE INDEX idx_clientes_activo ON clientes(activo);

-- Índices en CAMBIOS_OFFLINE
CREATE INDEX idx_cambios_offline_user ON cambios_offline(user_id);
CREATE INDEX idx_cambios_offline_sincronizado ON cambios_offline(sincronizado);

-- Índices en UBICACIONES_ADMIN
CREATE INDEX idx_ubicaciones_admin_user ON ubicaciones_admin(user_id);
CREATE INDEX idx_ubicaciones_admin_tianguis ON ubicaciones_admin(tianguis_id);
CREATE INDEX idx_ubicaciones_admin_timestamp ON ubicaciones_admin(timestamp DESC);

-- Índices en AUDITORÍAS
CREATE INDEX idx_auditorias_user ON auditorias(user_id);
CREATE INDEX idx_auditorias_created ON auditorias(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Políticas de Seguridad
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE tianguis ENABLE ROW LEVEL SECURITY;
ALTER TABLE puestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cambios_offline ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubicaciones_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditorias ENABLE ROW LEVEL SECURITY;

-- Políticas para TIANGUIS
CREATE POLICY "Usuarios autenticados pueden ver tianguis" ON tianguis
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admins pueden actualizar tianguis" ON tianguis
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Políticas para PUESTOS
CREATE POLICY "Usuarios autenticados pueden ver puestos" ON puestos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins pueden actualizar estado de puestos" ON puestos
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Políticas para ASIGNACIONES
CREATE POLICY "Admins pueden crear asignaciones" ON asignaciones
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins pueden ver todas las asignaciones" ON asignaciones
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins pueden actualizar asignaciones" ON asignaciones
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Políticas para CAMBIOS_OFFLINE
CREATE POLICY "Usuarios pueden ver sus propios cambios" ON cambios_offline
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Usuarios pueden insertar sus propios cambios" ON cambios_offline
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Políticas para UBICACIONES_ADMIN
CREATE POLICY "Admins pueden insertar su ubicación" ON ubicaciones_admin
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins pueden ver ubicaciones propias" ON ubicaciones_admin
    FOR SELECT USING (user_id = auth.uid());

-- Políticas para AUDITORÍAS
CREATE POLICY "Solo admins ven auditorías" ON auditorias
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función: Actualizar timestamp en UPDATE
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamp
CREATE TRIGGER trigger_update_tianguis
    BEFORE UPDATE ON tianguis
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_puestos
    BEFORE UPDATE ON puestos
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_clientes
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_asignaciones
    BEFORE UPDATE ON asignaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Función: Registrar auditoría
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO auditorias (
        user_id,
        accion,
        tabla,
        registro_id,
        datos_anteriores,
        datos_nuevos
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        NEW.id,
        to_jsonb(OLD),
        to_jsonb(NEW)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para auditoría en ASIGNACIONES
CREATE TRIGGER trigger_auditoria_asignaciones
    AFTER INSERT OR UPDATE ON asignaciones
    FOR EACH ROW
    EXECUTE FUNCTION registrar_auditoria();

-- ============================================
-- DATOS INICIALES (Ejemplo)
-- ============================================

-- Insertar un tianguis de ejemplo
INSERT INTO tianguis (
    nombre,
    calle,
    latitud,
    longitud,
    total_puestos,
    descripcion,
    ciudad,
    estado,
    pais
) VALUES (
    'Tianguis Central',
    'Calle Principal',
    20.6596,
    -87.0739,
    80,
    'Tianguis principal del municipio',
    'Ciudad de México',
    'CDMX',
    'México'
) ON CONFLICT DO NOTHING;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Ocupación Total del Tianguis
CREATE OR REPLACE VIEW vista_ocupacion_tianguis AS
SELECT
    t.id,
    t.nombre,
    COUNT(DISTINCT p.id) as total_puestos,
    COUNT(DISTINCT CASE WHEN p.estado = 'ocupado' THEN p.id END) as puestos_ocupados,
    COUNT(DISTINCT CASE WHEN p.estado = 'libre' THEN p.id END) as puestos_libres,
    ROUND(
        (COUNT(DISTINCT CASE WHEN p.estado = 'ocupado' THEN p.id END)::DECIMAL / 
         COUNT(DISTINCT p.id) * 100), 2
    ) as porcentaje_ocupacion
FROM tianguis t
LEFT JOIN puestos p ON t.id = p.tianguis_id
GROUP BY t.id, t.nombre;

-- Vista: Asignaciones Activas
CREATE OR REPLACE VIEW vista_asignaciones_activas AS
SELECT
    a.id,
    a.puesto_id,
    p.numero as numero_puesto,
    c.nombre as cliente_nombre,
    c.nombre_puesto,
    c.categoria,
    c.telefono,
    a.fecha_asignacion,
    a.estado_pago,
    a.monto_pago,
    t.nombre as tianguis_nombre
FROM asignaciones a
JOIN puestos p ON a.puesto_id = p.id
JOIN clientes c ON a.cliente_id = c.id
JOIN tianguis t ON a.tianguis_id = t.id
WHERE a.fecha_asignacion = CURRENT_DATE
ORDER BY p.numero;

-- Vista: Clientes Activos
CREATE OR REPLACE VIEW vista_clientes_activos AS
SELECT
    c.id,
    c.nombre,
    c.categoria,
    c.nombre_puesto,
    c.telefono,
    COUNT(DISTINCT a.id) as asignaciones_totales,
    MAX(a.fecha_asignacion) as ultima_asignacion
FROM clientes c
LEFT JOIN asignaciones a ON c.id = a.cliente_id
WHERE c.activo = true
GROUP BY c.id, c.nombre, c.categoria, c.nombre_puesto, c.telefono;
