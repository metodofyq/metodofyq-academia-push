#!/usr/bin/env python3
"""
Script para convertir PDFs a imágenes base64 para Nivel 0.5 (Infografías)

Uso:
    python3 scripts/pdf-to-infografias.py

Requisitos:
    pip install pdf2image pillow

Genera:
    - scripts/data/tema50_infografias.json
    - scripts/data/tema54_infografias.json
"""

import json
import base64
from pathlib import Path
from pdf2image import convert_from_path
from PIL import Image
import io
import sys

# Rutas de los PDFs
PDF_TEMA_50 = Path.home() / "Desktop/METODO FYQ/2a TEMAS/tema 50/comunidad Valenciana/Copia de Tema 50 Nivel 1 con imagenes (Com.Val).pdf"
PDF_TEMA_54 = Path.home() / "Desktop/METODO FYQ/2a TEMAS/tema 50/comunidad Valenciana/t54 n 0.5.pdf"

# Carpeta de salida
OUTPUT_DIR = Path("scripts/data")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def pdf_to_base64_array(pdf_path: Path, tema: str, max_pages: int = 10) -> list:
    """
    Convierte PDF a array de strings base64 JPEG.

    Args:
        pdf_path: Ruta del PDF
        tema: Nombre del tema (para logging)
        max_pages: Máximo número de páginas a procesar

    Returns:
        Array de strings con prefijo "data:image/jpeg;base64,"
    """
    if not pdf_path.exists():
        print(f"❌ ERROR: No se encontró {pdf_path}")
        return []

    print(f"\n📄 Procesando {tema}...")
    print(f"   Ruta: {pdf_path}")

    try:
        # Convertir PDF a imágenes
        print(f"   Convirtiendo PDF a imágenes...")
        images = convert_from_path(str(pdf_path))

        # Limitar a max_pages
        if len(images) > max_pages:
            print(f"   ⚠️  PDF tiene {len(images)} páginas, limitando a {max_pages}")
            images = images[:max_pages]

        print(f"   ✅ {len(images)} páginas convertidas")

        base64_array = []
        for i, image in enumerate(images, 1):
            print(f"   Comprimiendo página {i}/{len(images)}...", end=" ")

            # Redimensionar a ~720px ancho
            max_width = 720
            if image.width > max_width:
                ratio = max_width / image.width
                new_height = int(image.height * ratio)
                image = image.resize((max_width, new_height), Image.Resampling.LANCZOS)

            # Convertir a JPEG y comprimir
            buffer = io.BytesIO()
            image.convert('RGB').save(buffer, format='JPEG', quality=78, optimize=True)
            jpeg_data = buffer.getvalue()

            # Codificar a base64
            b64_string = base64.b64encode(jpeg_data).decode('utf-8')
            full_data_uri = f"data:image/jpeg;base64,{b64_string}"
            base64_array.append(full_data_uri)

            size_kb = len(jpeg_data) / 1024
            print(f"✅ ({size_kb:.1f}KB)")

        return base64_array

    except Exception as e:
        print(f"❌ ERROR al procesar {tema}: {e}")
        return []

def save_json(data: dict, output_path: Path):
    """Guarda diccionario como JSON con formato bonito."""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Guardado: {output_path}")

def main():
    print("=" * 80)
    print("CONVERTIDOR PDF → BASE64 PARA NIVEL 0.5 (INFOGRAFÍAS)")
    print("=" * 80)

    # Procesar Tema 50
    tema50_images = pdf_to_base64_array(PDF_TEMA_50, "TEMA-50")

    # Procesar Tema 54
    tema54_images = pdf_to_base64_array(PDF_TEMA_54, "TEMA-54")

    # Crear JSONs
    if tema50_images:
        tema50_json = {
            "tema": "TEMA-50",
            "nivel": 0.5,
            "titulo": "Infografías",
            "tipo": "infografias",
            "imagenes": tema50_images,
            "cantidad": len(tema50_images)
        }
        save_json(tema50_json, OUTPUT_DIR / "tema50_infografias.json")
    else:
        print("⚠️  No se pudo procesar Tema 50")

    if tema54_images:
        tema54_json = {
            "tema": "TEMA-54",
            "nivel": 0.5,
            "titulo": "Infografías",
            "tipo": "infografias",
            "imagenes": tema54_images,
            "cantidad": len(tema54_images)
        }
        save_json(tema54_json, OUTPUT_DIR / "tema54_infografias.json")
    else:
        print("⚠️  No se pudo procesar Tema 54")

    print("\n" + "=" * 80)
    print("✅ COMPLETADO")
    print("=" * 80)
    print(f"\n📂 Archivos generados en: {OUTPUT_DIR}")
    print(f"   - tema50_infografias.json ({len(tema50_images)} imágenes)")
    print(f"   - tema54_infografias.json ({len(tema54_images)} imágenes)")
    print("\n📝 Próximo paso: Ejecutar seed script para cargar en Supabase")
    print("   npx tsx scripts/seed-infografias.ts")

if __name__ == "__main__":
    main()
