"use client";

import { Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      {/* YouTube Notice */}
      <div className="max-w-5xl mx-auto mb-8 bg-gray-800 p-4 rounded-lg border border-red-600">
        <div className="flex items-center gap-2 mb-2">
          <Youtube className="w-5 h-5 text-red-600" />
          <span className="text-white font-semibold">Vídeos alojados en YouTube</span>
        </div>
        <p className="text-sm text-gray-400">
          Esta plataforma utiliza vídeos de YouTube. Al reproducirlos, aceptas los{" "}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Términos de Servicio de YouTube
          </a>
          {" "}y la{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Política de Privacidad de Google
          </a>
          . Consulta nuestra{" "}
          <a href="/privacidad" className="text-blue-400 hover:underline font-semibold">
            Política de Privacidad
          </a>
          {" "}para más información.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">Método FyQ</h4>
            <p className="text-sm">Academia de oposición para Física y Química · Secundaria</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <p className="text-sm">
              📧 <a href="mailto:metodofyq@metodofyq.com" className="text-blue-400 hover:underline">metodofyq@metodofyq.com</a>
              <br />
              📱 <a href="https://instagram.com/metodofyq" className="text-blue-400 hover:underline">@metodofyq</a>
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <p className="text-sm">
              <a href="/privacidad" className="text-blue-400 hover:underline">Política de privacidad</a>
              <br />
              <a href="/terminos" className="text-blue-400 hover:underline">Términos de uso</a>
              <br />
              <a href="mailto:metodofyq@metodofyq.com" className="text-blue-400 hover:underline">Contacto</a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          © 2026 Método FyQ. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
