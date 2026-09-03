#!/bin/bash

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "🚀 FASE 1: BASE DE DATOS Y DATOS - EJECUCIÓN COMPLETA"
echo "════════════════════════════════════════════════════════════════════════"

echo ""
echo "1️⃣ Re-cargando Tema 50 y 54 (sin Propuesta didáctica en Nivel 3)..."
npx tsx scripts/seed-temas-fixed.ts

echo ""
echo "2️⃣ Insertando legislación por CCAA..."
npx tsx scripts/seed-legislation-by-ccaa.ts

echo ""
echo "3️⃣ Insertando Propuesta didáctica como nuevo nivel..."
npx tsx scripts/seed-propuesta-didactica.ts

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "✅ FASE 1 COMPLETADA"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "📋 Próximos pasos:"
echo "   • FASE 2: Modificar componentes y página de routing"
echo "   • FASE 3: Implementar lógica de restricción por CCAA/grupo"
echo ""
