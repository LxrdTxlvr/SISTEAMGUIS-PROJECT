// Archivo: backend/queries.sql

-- Obtener ocupación actual
SELECT 
  COUNT(*) as total_puestos,
  COUNT(CASE WHEN estado = 'ocupado' THEN 1 END) as ocupados,
  ROUND(COUNT(CASE WHEN estado = 'ocupado' THEN 1 END)::numeric / COUNT(*) * 100, 2) as porcentaje_ocupacion
FROM puestos
WHERE tianguis_id = 'TIANGUIS_ID';

-- Obtener asignaciones de hoy
SELECT 
  a.id,
  p.numero,
  c.nombre,
  c.nombre_puesto,
  c.categoria,
  c.telefono,
  a.estado_pago
FROM asignaciones a
JOIN puestos p ON a.puesto_id = p.id
JOIN clientes c ON a.cliente_id = c.id
WHERE a.tianguis_id = 'TIANGUIS_ID'
  AND a.fecha_asignacion = CURRENT_DATE
ORDER BY p.numero;

-- Clientes que más frecuentan el tianguis
SELECT 
  c.nombre,
  c.nombre_puesto,
  COUNT(*) as total_asignaciones,
  MAX(a.fecha_asignacion) as ultima_visita
FROM clientes c
LEFT JOIN asignaciones a ON c.id = a.cliente_id
GROUP BY c.id, c.nombre, c.nombre_puesto
ORDER BY COUNT(*) DESC
LIMIT 10;

-- Cambios pendientes de sincronizar
SELECT 
  user_id,
  COUNT(*) as cambios_pendientes
FROM cambios_offline
WHERE sincronizado = false
GROUP BY user_id;