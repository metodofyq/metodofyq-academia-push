export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Términos de Uso</h1>
          <p className="text-blue-100">Método FyQ - Academia de Oposición</p>
          <p className="text-sm text-blue-100 mt-4">Última actualización: noviembre de 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Información del Titular</h2>
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="mb-3"><strong>Titular:</strong> Ester Berbel Pedrosa</p>
            <p className="mb-3"><strong>NIF:</strong> 77795406E</p>
            <p className="mb-3"><strong>Domicilio:</strong> Carrer Sant Isidre 3C Po1 4, El pont d'Armentera, 43817 Tarragona, España</p>
            <p className="mb-3"><strong>Email:</strong> <a href="mailto:metodofyq@metodofyq.com" className="text-blue-600 hover:underline">metodofyq@metodofyq.com</a></p>
            <p className="mb-3"><strong>Teléfono:</strong> 611 946 828</p>
            <p><strong>Web:</strong> <a href="https://www.metodofyq.es" className="text-blue-600 hover:underline">www.metodofyq.es</a></p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Objeto de la Plataforma</h2>
          <p className="text-gray-700 mb-4">
            Método FyQ es una <strong>academia de oposición online</strong> para la preparación de las oposiciones a profesor de Física y Química en Educación Secundaria. La plataforma proporciona:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
            <li>Contenido didáctico estructurado (75 temas)</li>
            <li>Ejercicios prácticos y evaluaciones</li>
            <li>Seguimiento del progreso académico</li>
            <li>Simulacros y retroalimentación personalizada</li>
            <li>Materiales de estudio en video y texto</li>
          </ul>
          <p className="text-gray-700">
            El acceso a esta plataforma está limitado a personas mayores de 18 años que se registren voluntariamente. No está permitido el acceso de menores de 14 años bajo ninguna circunstancia.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Condiciones de Uso</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Registro y Cuenta</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Debes proporcionar información veraz y completa al registrarte</li>
                <li>Eres responsable de mantener tu contraseña confidencial</li>
                <li>No compartirás tu cuenta con otras personas</li>
                <li>Notificarás inmediatamente de cualquier uso no autorizado</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Uso Permitido</h3>
              <p className="text-gray-700 mb-2">Puedes usar esta plataforma únicamente para:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Tu propio aprendizaje y preparación de oposiciones</li>
                <li>Consultar materiales y realizar ejercicios</li>
                <li>Recibir retroalimentación sobre tu progreso</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">3.3 Uso Prohibido</h3>
              <p className="text-gray-700 mb-2">No permitimos:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Copiar, distribuir o reproducir contenidos sin autorización</li>
                <li>Compartir tus credenciales de acceso con terceros</li>
                <li>Usar bots, scrapers o herramientas automatizadas</li>
                <li>Acceder a funcionalidades restringidas sin permiso</li>
                <li>Usar la plataforma para fines comerciales o competitivos</li>
                <li>Acoso, intimidación o conducta inapropiada hacia otros usuarios</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Propiedad Intelectual</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Derechos de Método FyQ</h3>
              <p className="text-gray-700 mb-3">
                Todos los contenidos de esta plataforma (textos, imágenes, vídeos, ejercicios, estructuras, diseños) son propiedad intelectual de Ester Berbel Pedrosa o están debidamente licensiados. Estos contenidos están protegidos por:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Derechos de autor españoles (Real Decreto Legislativo 1/1996)</li>
                <li>Legislación internacional de propiedad intelectual</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Licencia Limitada</h3>
              <p className="text-gray-700">
                Al acceder a la plataforma, te otorgamos una licencia <strong>personal, no transferible y limitada</strong> para usar los contenidos solo para tu aprendizaje. No puedes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mt-2">
                <li>Reproducir o distribuir los contenidos</li>
                <li>Crear obras derivadas basadas en el contenido</li>
                <li>Vender, alquilar o prestar acceso a terceros</li>
                <li>Modificar o adaptar los contenidos sin permiso</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Contenidos que Subes</h3>
              <p className="text-gray-700">
                Si subes contenidos a la plataforma (respuestas a ejercicios, comentarios, archivos), nos otorgas una licencia para almacenarlos, procesarlos y utilizarlos para mejorar el servicio. Eres responsable de que tu contenido no infrinja derechos de terceros.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Limitación de Responsabilidad</h2>

          <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
            <p className="text-gray-700 mb-4">
              <strong>LA PLATAFORMA SE PROPORCIONA "TAL COMO ESTÁ"</strong> sin garantías adicionales. Método FyQ no es responsable de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Errores, fallos técnicos o interrupciones del servicio</li>
              <li>Pérdida de datos (aunque usamos medidas de seguridad)</li>
              <li>Resultados en las oposiciones (el servicio es una herramienta de preparación)</li>
              <li>Daños indirectos, pérdidas de oportunidades u otros daños</li>
              <li>Conducta de otros usuarios de la plataforma</li>
              <li>Contenidos externos (incluidos vídeos de YouTube)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>En ningún caso la responsabilidad máxima superará la cantidad que pagaste por el servicio en los últimos 12 meses.</strong>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Vídeos de YouTube</h2>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 mb-3">
                Esta plataforma incluye vídeos alojados en <strong>YouTube</strong> y reproducidos mediante el reproductor estándar de YouTube. Al reproducir estos vídeos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Aceptas los <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Términos del Servicio de YouTube</a></li>
                <li>Aceptas la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Política de Privacidad de Google</a></li>
                <li>YouTube/Google pueden recopilar datos sobre tu reproducción</li>
              </ul>
            </div>

            <p className="text-gray-700">
              Ester Berbel Pedrosa no controla qué datos recopila YouTube, ni es responsable de cómo Google trata tu información. Para detalles, consulta directamente las políticas de YouTube y Google en los enlaces anteriores.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Legislación Aplicable y Jurisdicción</h2>

          <p className="text-gray-700 mb-4">
            Estos Términos de Uso se rigen por las leyes españolas, en concreto:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-4">
            <li><strong>Ley de Servicios de la Sociedad de la Información (LSSI-CE)</strong> - Ley 34/2002</li>
            <li><strong>Código Civil Español</strong> - Ley 1/2000</li>
            <li><strong>Ley de Protección de Datos</strong> - RGPD y LOPDGDD</li>
            <li>Normativa de defensa del consumidor de España</li>
          </ul>

          <p className="text-gray-700 mb-4">
            <strong>Jurisdicción:</strong> Los tribunales españoles serán competentes para resolver cualquier disputa relacionada con estos términos. Específicamente, los juzgados de Tarragona tienen competencia territorial.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <p className="text-sm text-gray-700">
              Para reclamaciones de defectos del servicio, puedes contactar con la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.aepd.es</a> o con las autoridades de consumo locales.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Cambios en los Términos</h2>

          <p className="text-gray-700 mb-4">
            Ester Berbel Pedrosa se reserva el derecho de modificar estos Términos de Uso en cualquier momento. Los cambios significativos serán notificados por email a los usuarios registrados. El uso continuado de la plataforma implica aceptación de los términos modificados.
          </p>

          <p className="text-gray-700">
            Si no estás de acuerdo con los nuevos términos, puedes solicitar la cancelación de tu cuenta y recuperación de datos conforme a la Política de Privacidad.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Contacto y Reclamaciones</h2>

          <p className="text-gray-700 mb-4">
            Si tienes dudas sobre estos términos o quieres presentar una reclamación:
          </p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-300 space-y-2">
            <p><strong>Email:</strong> <a href="mailto:metodofyq@metodofyq.com" className="text-blue-600 hover:underline">metodofyq@metodofyq.com</a></p>
            <p><strong>Teléfono:</strong> 611 946 828</p>
            <p><strong>Dirección:</strong> Carrer Sant Isidre 3C Po1 4, El pont d'Armentera, 43817 Tarragona, España</p>
          </div>

          <p className="text-gray-700 mt-6">
            Te responderemos en el plazo de 30 días desde la recepción de tu solicitud.
          </p>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-blue-600">
          <p className="text-gray-700 text-center">
            <strong>Última actualización:</strong> Noviembre de 2026<br />
            <strong>Próxima revisión prevista:</strong> Noviembre de 2027
          </p>
        </section>
      </div>
    </div>
  )
}
