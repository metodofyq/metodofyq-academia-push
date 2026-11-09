"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
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
