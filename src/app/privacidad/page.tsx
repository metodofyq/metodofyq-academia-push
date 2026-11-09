export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-blue-100">Método FyQ - Academia de Oposición</p>
          <p className="text-sm text-blue-100 mt-4">Última actualización: noviembre de 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <h2 className="font-bold text-lg mb-4">Índice</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#identidad" className="text-blue-600 hover:underline">1. Identidad del responsable</a></li>
            <li><a href="#datos" className="text-blue-600 hover:underline">2. Datos que tratamos</a></li>
            <li><a href="#finalidad" className="text-blue-600 hover:underline">3. Finalidad y base legal</a></li>
            <li><a href="#conservacion" className="text-blue-600 hover:underline">4. Conservación de datos</a></li>
            <li><a href="#destinatarios" className="text-blue-600 hover:underline">5. Destinatarios y proveedores</a></li>
            <li><a href="#derechos" className="text-blue-600 hover:underline">6. Tus derechos</a></li>
            <li><a href="#seguridad" className="text-blue-600 hover:underline">7. Medidas de seguridad</a></li>
            <li><a href="#youtube" className="text-blue-600 hover:underline">8. YouTube y Google</a></li>
            <li><a href="#cookies" className="text-blue-600 hover:underline">9. Cookies</a></li>
          </ul>
        </nav>

        <section id="identidad" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Identidad del Responsable</h2>
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <p className="mb-3"><strong>Titular:</strong> Ester Berbel Pedrosa</p>
            <p className="mb-3"><strong>NIF:</strong> 77795406E</p>
            <p className="mb-3"><strong>Domicilio:</strong> Carrer Sant Isidre 3C Po1 4, El pont d'Armentera, 43817 Tarragona, España</p>
            <p className="mb-3"><strong>Email (privacidad):</strong> <a href="mailto:metodofyq@metodofyq.com" className="text-blue-600 hover:underline">metodofyq@metodofyq.com</a></p>
            <p className="mb-3"><strong>Teléfono:</strong> 611 946 828</p>
            <p><strong>Sitio web:</strong> <a href="https://www.metodofyq.es" className="text-blue-600 hover:underline">www.metodofyq.es</a></p>
          </div>
          <p className="mt-6 text-gray-700">
            Ester Berbel Pedrosa, en calidad de profesora de Física y Química, es la responsable del tratamiento de tus datos personales en el contexto de la academia de oposición Método FyQ. Esta política de privacidad te informa sobre cómo recopilamos, usamos y protegemos tus datos de conformidad con la legislación española y europea.
          </p>
        </section>

        <section id="datos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Datos que Recopilamos</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Datos de Registro e Identificación</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Contraseña (encriptada)</li>
                <li>Foto de perfil (opcional)</li>
                <li>Comunidad Autónoma (CCAA)</li>
                <li>Grupo de estudio (1 o 2)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📚 Datos de Progreso Académico</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Temas completados en el plan de estudio</li>
                <li>Niveles alcanzados (N0 a N4) en cada tema</li>
                <li>Tiempo total de estudio (en minutos)</li>
                <li>Respuestas a ejercicios y evaluaciones</li>
                <li>Logros y medallas obtenidas</li>
                <li>Fechas de última actividad</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">💬 Datos de Contacto</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Email y teléfono (si los proporcionas en el formulario de contacto)</li>
                <li>Contenido de los mensajes enviados</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔔 Datos de Leads (Formulario de Landing)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Email</li>
                <li>Comunidad Autónoma</li>
                <li>Situación laboral (primer-vez, varias-convocatorias, indecisos)</li>
                <li>Origen del lead (fuente de procedencia)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Datos Técnicos y de Navegación</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Dirección IP</li>
                <li>Tipo y versión del navegador</li>
                <li>Sistema operativo</li>
                <li>Páginas visitadas</li>
                <li>Hora y fecha de acceso</li>
                <li>Información de cookies (ver sección 8)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mt-6">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Nota:</strong> No recopilamos datos de personas menores de 14 años. Si eres menor, no te puedes registrar sin consentimiento de tus padres o tutores legales.
            </p>
          </div>
        </section>

        <section id="finalidad" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Finalidad y Base Legal del Tratamiento</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">✅ Para crear y gestionar tu cuenta</h3>
              <p className="text-gray-700 mb-2"><strong>Finalidad:</strong> Permitirte registrarte, acceder a la plataforma y gestionar tu perfil.</p>
              <p className="text-gray-700"><strong>Base legal:</strong> Ejecución del contrato de acceso a la plataforma (art. 6.1.b RGPD).</p>
              <p className="text-gray-700 text-sm mt-2"><strong>Datos:</strong> Email, contraseña, nombre completo, CCAA, grupo.</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">✅ Para tu aprendizaje y seguimiento académico</h3>
              <p className="text-gray-700 mb-2"><strong>Finalidad:</strong> Registrar tu progreso, mostrar tu plan personalizado, emitir certificados y detectar áreas de mejora.</p>
              <p className="text-gray-700"><strong>Base legal:</strong> Ejecución del contrato educativo (art. 6.1.b RGPD).</p>
              <p className="text-gray-700 text-sm mt-2"><strong>Datos:</strong> Temas completados, niveles, tiempo de estudio, respuestas a ejercicios, logros.</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">✅ Para contacto y atención al cliente</h3>
              <p className="text-gray-700 mb-2"><strong>Finalidad:</strong> Responder tus consultas, enviar actualizaciones sobre tu plan y resolver problemas técnicos.</p>
              <p className="text-gray-700"><strong>Base legal:</strong> Interés legítimo (art. 6.1.f RGPD) en mantener una buena relación con nuestros usuarios.</p>
              <p className="text-gray-700 text-sm mt-2"><strong>Datos:</strong> Email, teléfono, contenido de mensajes.</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">✅ Para analítica web y mejora del servicio</h3>
              <p className="text-gray-700 mb-2"><strong>Finalidad:</strong> Entender cómo se usa la plataforma, mejorar funcionalidades y detectar errores.</p>
              <p className="text-gray-700"><strong>Base legal:</strong> Interés legítimo (art. 6.1.f RGPD) en optimizar nuestros servicios.</p>
              <p className="text-gray-700 text-sm mt-2"><strong>Datos:</strong> Datos técnicos, navegación, tiempo en página (sin identificación personal en algunos casos).</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">✅ Para fines comerciales y comunicaciones</h3>
              <p className="text-gray-700 mb-2"><strong>Finalidad:</strong> Informarte sobre nuevas funcionalidades, promociones y actualizaciones (solo si has optado por ello).</p>
              <p className="text-gray-700"><strong>Base legal:</strong> Consentimiento previo (art. 6.1.a RGPD) o interés legítimo en manterte informado.</p>
              <p className="text-gray-700 text-sm mt-2"><strong>Datos:</strong> Email, CCAA, situación laboral.</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">✅ Para cumplimiento legal</h3>
              <p className="text-gray-700 mb-2"><strong>Finalidad:</strong> Cumplir con obligaciones legales, fiscales y de seguridad.</p>
              <p className="text-gray-700"><strong>Base legal:</strong> Obligación legal (art. 6.1.c RGPD).</p>
              <p className="text-gray-700 text-sm mt-2"><strong>Datos:</strong> Datos de transacciones, registros de acceso, logs del sistema.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-6">
            <p className="text-sm text-gray-700">
              <strong>ℹ️ Información importante:</strong> Si retiras el consentimiento para comunicaciones comerciales, dejaremos de enviarte información de marketing, pero seguiremos manteniendo tu cuenta y tus datos académicos según lo establecido en el contrato.
            </p>
          </div>
        </section>

        <section id="conservacion" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Conservación de Datos</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">Los datos se conservarán según el siguiente criterio:</p>

              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2 text-left">Tipo de Dato</th>
                    <th className="border border-gray-300 p-2 text-left">Período de Conservación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Datos de cuenta (email, nombre, contraseña)</td>
                    <td className="border border-gray-300 p-2">Mientras la cuenta esté activa + 1 año después de la baja</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Progreso académico (ejercicios, calificaciones)</td>
                    <td className="border border-gray-300 p-2">Mientras la cuenta esté activa (para certificación)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Datos de contacto (mensajes, formularios)</td>
                    <td className="border border-gray-300 p-2">3 años (por obligaciones legales)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Datos técnicos (logs, IP, navegación)</td>
                    <td className="border border-gray-300 p-2">6 meses máximo</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Leads (formulario landing)</td>
                    <td className="border border-gray-300 p-2">12 meses (salvo que se registren)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Datos de transferencias bancarias</td>
                    <td className="border border-gray-300 p-2">6 años (obligación fiscal española)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700">
              Después de estos períodos, los datos se eliminarán de forma segura, salvo que exista una obligación legal que requiera conservarlos más tiempo.
            </p>
          </div>
        </section>

        <section id="destinatarios" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Destinatarios y Encargados del Tratamiento</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🔗 Proveedores que acceden a tus datos:</h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="font-semibold text-gray-800">1. Supabase (Base de datos y autenticación)</p>
                  <p className="text-sm text-gray-600 mb-2">📍 Servidores: USA</p>
                  <p className="text-gray-700 text-sm">Supabase almacena de forma segura tu cuenta, contraseña, progreso académico y datos personales. Tienen implementadas cláusulas de procesamiento de datos conforme al RGPD.</p>
                  <p className="text-sm text-blue-600 mt-1"><a href="https://supabase.com/privacy" className="hover:underline">Política de privacidad de Supabase</a></p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">2. Vercel (Hosting y despliegue)</p>
                  <p className="text-sm text-gray-600 mb-2">📍 Servidores: Global (USA, Europa)</p>
                  <p className="text-gray-700 text-sm">Vercel aloja la aplicación web. Accede a datos técnicos (logs, IP) pero no a datos personales sensibles.</p>
                  <p className="text-sm text-blue-600 mt-1"><a href="https://vercel.com/legal/privacy" className="hover:underline">Política de privacidad de Vercel</a></p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">3. Google (Análisis web)</p>
                  <p className="text-sm text-gray-600 mb-2">📍 Servidores: USA</p>
                  <p className="text-gray-700 text-sm">Usamos Google Analytics para entender cómo se usa la plataforma (páginas visitadas, tiempo en sitio, dispositivo). Google puede usar estos datos según sus propias políticas.</p>
                  <p className="text-sm text-blue-600 mt-1"><a href="https://policies.google.com/privacy" className="hover:underline">Política de privacidad de Google</a></p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">4. Google Fonts</p>
                  <p className="text-sm text-gray-600 mb-2">📍 Servidores: Google (USA)</p>
                  <p className="text-gray-700 text-sm">Las tipografías se cargan desde Google Fonts. Consulta su política sobre datos de navegación.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-semibold text-gray-800 mb-2">⚠️ Transferencias internacionales</h3>
              <p className="text-gray-700 text-sm">
                Algunos de nuestros proveedores están ubicados en EE.UU. La Unión Europea ha reconocido que EE.UU. no tiene un nivel de protección de datos equivalente. Sin embargo, estos proveedores han firmado cláusulas estándar de protección de datos conforme al RGPD. Tienes derecho a conocer más detalles en <a href="https://www.aepd.es" className="text-blue-600 hover:underline">www.aepd.es</a>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">👥 Otros destinatarios:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li><strong>Profesores/administradores:</strong> Pueden ver tu progreso académico para tutorías y seguimiento (si tienes asignado un profesor).</li>
                <li><strong>Autoridades públicas:</strong> Si es requerido por ley (policía, juzgados, Agencia Tributaria).</li>
                <li><strong>Terceros contratados:</strong> Solo si es necesario para prestar el servicio (ej: servicio técnico).</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="derechos" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Tus Derechos</h2>

          <p className="text-gray-700 mb-6">
            Conforme a la legislación de protección de datos (RGPD y LOPDGDD), tienes derecho a:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">📄 Derecho de Acceso</h3>
              <p className="text-gray-700">Puedes solicitar una copia de todos tus datos que almacenamos. Te la entregaremos en un formato estructurado y legible.</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">✏️ Derecho de Rectificación</h3>
              <p className="text-gray-700">Si algún dato es incorrecto (ej: email, nombre), puedes solicitarnos que lo corrija. En tu perfil puedes cambiar algunos datos directamente.</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">🗑️ Derecho de Supresión ("Derecho al olvido")</h3>
              <p className="text-gray-700">Puedes solicitar que eliminemos tus datos, salvo en casos donde exista una obligación legal de mantenerlos (ej: datos fiscales, contratos).</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">⛔ Derecho de Oposición</h3>
              <p className="text-gray-700">Puedes oponerte al tratamiento de tus datos en cualquier momento, especialmente para comunicaciones comerciales.</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">🛑 Derecho de Limitación del Tratamiento</h3>
              <p className="text-gray-700">Puedes solicitar que limitemos el uso de tus datos mientras verificamos si son correctos o si existe un interés legítimo.</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">📦 Derecho de Portabilidad</h3>
              <p className="text-gray-700">Tienes derecho a recibir tus datos en un formato estructurado (como un archivo CSV o JSON) para transferirlos a otra plataforma.</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-800 mb-2">🔄 Derecho a Retirar el Consentimiento</h3>
              <p className="text-gray-700">Si algún tratamiento se basa en tu consentimiento, puedes retirarlo en cualquier momento (ej: comunicaciones de marketing).</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">📞 Cómo ejercer tus derechos</h3>
            <p className="text-gray-700 text-sm mb-2">
              Para ejercer cualquiera de estos derechos, envía un email a <a href="mailto:metodofyq@metodofyq.com" className="text-blue-600 hover:underline">metodofyq@metodofyq.com</a> o llama al <strong>611 946 828</strong>.
            </p>
            <p className="text-gray-700 text-sm mb-2">
              Indica claramente:
            </p>
            <ul className="text-sm text-gray-700 list-disc list-inside ml-2 space-y-1">
              <li>Tu nombre completo e email registrado</li>
              <li>Qué derecho quieres ejercer</li>
              <li>Una descripción de lo que solicitas</li>
            </ul>
            <p className="text-gray-700 text-sm mt-2">
              Responderemos en <strong>máximo 30 días</strong>. Si es necesario más tiempo, te lo comunicaremos.
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">⚖️ Derecho a Reclamar ante la Autoridad de Control</h3>
            <p className="text-gray-700 text-sm mb-2">
              Si crees que hemos vulnerado tus derechos de protección de datos, puedes presentar una reclamación ante:
            </p>
            <p className="text-gray-700 text-sm font-semibold">
              <strong>Agencia Española de Protección de Datos (AEPD)</strong><br />
              📍 C/ Jorge Juan, 6, 28001 Madrid<br />
              📧 <a href="https://www.aepd.es" className="text-blue-600 hover:underline">www.aepd.es</a>
            </p>
          </div>
        </section>

        <section id="seguridad" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Medidas de Seguridad</h2>

          <p className="text-gray-700 mb-6">
            Implementamos medidas técnicas, organizativas y legales para proteger tus datos:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-xl">🔐</span>
              <div>
                <p className="font-semibold text-gray-800">Encriptación</p>
                <p className="text-gray-700 text-sm">Todos los datos se transmiten por HTTPS encriptado (protocolo seguro). Las contraseñas se almacenan de forma hash irreversible.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-semibold text-gray-800">Control de Acceso</p>
                <p className="text-gray-700 text-sm">Solo el personal autorizado puede acceder a datos personales. Los accesos se registran.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-semibold text-gray-800">Políticas de Confidencialidad</p>
                <p className="text-gray-700 text-sm">Los proveedores que acceden a tus datos están obligados contractualmente a mantener la confidencialidad.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">🔄</span>
              <div>
                <p className="font-semibold text-gray-800">Backups y Recuperación</p>
                <p className="text-gray-700 text-sm">Realizamos copias de seguridad regulares para prevenir pérdida de datos.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">📊</span>
              <div>
                <p className="font-semibold text-gray-800">Auditorías</p>
                <p className="text-gray-700 text-sm">Realizamos revisiones periódicas de seguridad para identificar vulnerabilidades.</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mt-6">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Responsabilidad del usuario:</strong> Aunque usamos medidas de seguridad estrictas, ningún sistema es 100% seguro. Es tu responsabilidad mantener tu contraseña confidencial, no compartirla y cerrar sesión cuando termines.
            </p>
          </div>
        </section>

        <section id="youtube" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Vídeos de YouTube y Servicios de Google</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎥 Integración de Vídeos de YouTube</h3>
              <p className="text-gray-700 mb-4">
                Esta web inserta vídeos alojados en YouTube mediante el reproductor estándar de YouTube. Estos vídeos pueden estar integrados tanto de forma embebida como mediante enlaces directos a youtube-nocookie.com.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">⚠️ Importante sobre tus datos en YouTube</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Cuando reproduces un vídeo de YouTube en esta web:</strong>
                </p>
                <ul className="text-sm text-gray-700 list-disc list-inside ml-2 space-y-1">
                  <li>YouTube/Google puede recopilar datos sobre tu navegación y reproducción de vídeos</li>
                  <li>Google utiliza cookies propias para rastrear tu actividad</li>
                  <li>Los términos de servicio y política de privacidad de Google aplican a esa reproducción</li>
                  <li>Ester Berbel Pedrosa (titular de esta web) NO controla qué datos recopila Google</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Términos del Servicio de YouTube</h3>
              <p className="text-gray-700 mb-3">
                Al reproducir vídeos de YouTube en esta web, aceptas los Términos del Servicio de YouTube:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                  https://www.youtube.com/t/terms
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔒 Política de Privacidad de Google</h3>
              <p className="text-gray-700 mb-3">
                Para conocer cómo Google trata tus datos al reproducir vídeos:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                  https://policies.google.com/privacy
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🛠️ Uso de la API de YouTube</h3>
              <p className="text-gray-700 mb-4">
                Ester Berbel Pedrosa utiliza los Servicios de API de YouTube para gestionar y publicar vídeos en el canal oficial de Método FyQ.
                <strong> Es importante que sepas:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                <li>La herramienta de subida de vídeos accede <strong>únicamente al canal propio</strong> de Método FyQ</li>
                <li>NO accede a datos de cuentas de YouTube de los usuarios de esta web</li>
                <li>NO almacena credenciales ni datos de otros usuarios de YouTube</li>
                <li>NO comparte acceso a tus datos de YouTube con terceros</li>
                <li>Los vídeos que subes a través de esta plataforma se publican en el canal de Método FyQ según sus términos</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔄 Revocar Acceso a tu Cuenta de Google</h3>
              <p className="text-gray-700 mb-3">
                Si en algún momento autorizaste a esta web o a Método FyQ a acceder a tu cuenta de Google/YouTube, puedes revocar ese acceso en cualquier momento:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <p className="font-semibold text-gray-800 mb-2">Revoca el acceso aquí:</p>
                <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  https://security.google.com/settings/security/permissions
                </a>
                <p className="text-sm text-gray-600 mt-2">Busca "Método FyQ" o "metodofyq" en la lista de aplicaciones conectadas y haz clic en "Eliminar acceso".</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-gray-800 mb-2">⚠️ Reproducción sin Google</h4>
              <p className="text-sm text-gray-700">
                Esta web intenta usar <code className="bg-gray-100 px-2 py-1 rounded">youtube-nocookie.com</code> cuando es posible, que reduce el rastreo de Google pero no lo elimina completamente. Si prefieres evitar YouTube completamente, puedes contactar a <a href="mailto:metodofyq@metodofyq.com" className="text-blue-600 hover:underline">metodofyq@metodofyq.com</a> para solicitar contenido alternativo.
              </p>
            </div>
          </div>
        </section>

        <section id="cookies" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Cookies y Tecnologías de Rastreo</h2>

          <p className="text-gray-700 mb-4">
            Este sitio web usa cookies para mejorar la experiencia de navegación y analizar el uso.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">¿Qué es una cookie?</h3>
          <p className="text-gray-700 mb-6">
            Una cookie es un archivo pequeño que se descarga en tu navegador cuando accedes a un sitio web. Se almacena en tu ordenador y permite que recordemos tus preferencias.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tipos de cookies que usamos:</h3>

          <table className="w-full text-sm border-collapse mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">Tipo</th>
                <th className="border border-gray-300 p-2 text-left">Finalidad</th>
                <th className="border border-gray-300 p-2 text-left">Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2"><strong>Sesión</strong></td>
                <td className="border border-gray-300 p-2">Mantener tu sesión iniciada, autenticación</td>
                <td className="border border-gray-300 p-2">Mientras navegas (se elimina al cerrar)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2"><strong>Preferencias</strong></td>
                <td className="border border-gray-300 p-2">Guardar idioma, tema (claro/oscuro), preferencias de visualización</td>
                <td className="border border-gray-300 p-2">Hasta 1 año</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><strong>Analítica</strong></td>
                <td className="border border-gray-300 p-2">Entender cómo se usa la plataforma (Google Analytics)</td>
                <td className="border border-gray-300 p-2">Hasta 2 años</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2"><strong>Seguridad</strong></td>
                <td className="border border-gray-300 p-2">Proteger contra ataques, detectar fraude</td>
                <td className="border border-gray-300 p-2">Según sea necesario</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Control de cookies</h3>
          <p className="text-gray-700 mb-3">
            Puedes controlar las cookies desde tu navegador:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-6">
            <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y datos de sitios web</li>
            <li><strong>Firefox:</strong> Preferencias → Privacidad → Cookies</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad → Administrar datos del sitio web</li>
            <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-700">
              <strong>ℹ️ Nota:</strong> Si desactivas las cookies de sesión, es posible que no puedas iniciar sesión. Las cookies de analítica son opcionales y no afectan al funcionamiento de la plataforma.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Información Adicional</h2>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">📧 Cambios en esta Política</h3>
          <p className="text-gray-700 mb-6">
            Esta política puede ser actualizada en cualquier momento para reflejar cambios en nuestras prácticas o en la legislación. Te notificaremos por email de cambios importantes.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">📞 Contacto para Privacidad</h3>
          <p className="text-gray-700 mb-4">
            Si tienes preguntas sobre esta política o sobre cómo tratamos tus datos:
          </p>
          <div className="bg-white p-4 border border-gray-300 rounded-lg">
            <p className="mb-2"><strong>📧 Email:</strong> <a href="mailto:metodofyq@metodofyq.com" className="text-blue-600 hover:underline">metodofyq@metodofyq.com</a></p>
            <p className="mb-2"><strong>📱 Teléfono:</strong> 611 946 828</p>
            <p><strong>📍 Dirección:</strong> Carrer Sant Isidre 3C Po1 4, El pont d'Armentera, 43817 Tarragona, España</p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">⚖️ Cumplimiento Legal</h3>
          <p className="text-gray-700 mb-2">
            Esta política de privacidad cumple con:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
            <li>RGPD - Reglamento UE 2016/679</li>
            <li>LOPDGDD - Ley Orgánica 3/2018</li>
            <li>LSSI-CE - Ley 34/2002 (Sociedad de la Información)</li>
          </ul>
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
