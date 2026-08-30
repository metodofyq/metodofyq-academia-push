"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-auto flex items-center">
            <Image
              src="/logo.png"
              alt="Método FyQ"
              width={200}
              height={24}
              className="h-10 w-auto"
              priority
            />
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm">
          <a href="#method4exams" className="text-gray-700 hover:text-blue-900">Método</a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-900">Precios</a>
          <a href="#faq" className="text-gray-700 hover:text-blue-900">FAQ</a>
          <a href="/recursos" className="text-gray-700 hover:text-blue-900">Recursos gratuitos</a>
          <a href="/prueba" className="text-gray-700 hover:text-blue-900">Prueba nuestro sistema</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-900">
            Iniciar sesión
          </a>
          <a
            href="https://buy.stripe.com/test/placeholder"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-semibold"
          >
            Inscribirse
          </a>
        </div>
      </div>
    </header>
  );
}
