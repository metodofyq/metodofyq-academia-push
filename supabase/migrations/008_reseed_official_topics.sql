-- ============================================================
-- Re-seed: temario OFICIAL de la oposición (75 temas numerados)
-- ============================================================
-- Sustituye la lista interna FIS-01..35 / QUI-01..40 (una división
-- arbitraria por subtema) por el temario oficial real, numerado tal y
-- como aparece en el examen: TEMA-01..TEMA-75. Esto es necesario para
-- que "Tema 19" (naturaleza eléctrica de la materia / electrostática)
-- se corresponda con el Tema 19 oficial, no con un tema interno distinto
-- (el FIS-19 antiguo era "Óptica ondulatoria").
--
-- ADVERTENCIA: el truncate en cascada borra topic_levels, exercises,
-- study_plan_topics, topic_progress, spaced_repetition,
-- exercise_attempts y daily_tasks asociados a los topics actuales
-- (son datos de seed/demo, no progreso real de alumnos).

-- Ampliar el check de "subject": el temario oficial cubre también
-- geología y biología, y varios temas transversales/históricos.
alter table public.topics drop constraint if exists topics_subject_check;
alter table public.topics add constraint topics_subject_check
  check (subject in ('fisica', 'quimica', 'geologia', 'biologia', 'general'));

truncate table public.topics cascade;

insert into public.topics (code, title, subject, order_index) values
('TEMA-01', 'Concepciones principales de la ciencia. Los grandes cambios: las revoluciones científicas. La ciencia como un proceso en continua construcción: algún ejemplo en física o en química. Los científicos y sus condicionamientos sociales. Las actitudes científicas en la vida cotidiana.', 'general', 1),
('TEMA-02', 'Momentos clave en el desarrollo de la física y de la química. Principales científicos o grupos de científicos implicados. Problemas físicos y químicos prioritarios en la investigación actual.', 'general', 2),
('TEMA-03', 'Magnitudes físicas y químicas. Sistema internacional de unidades. La medida. Métodos de estimación de la incertidumbre en la medición y en la determinación de resultados.', 'general', 3),
('TEMA-04', 'Cinemática. Elementos para la descripción del movimiento. Movimientos de interés especial. Métodos para el estudio experimental del movimiento.', 'fisica', 4),
('TEMA-05', 'Evolución histórica de la relación fuerza-movimiento. Dinámica de la partícula. Leyes de Newton. Principio de conservación del momento lineal. Aplicaciones.', 'fisica', 5),
('TEMA-06', 'Movimiento de rotación de una partícula. Cinemática y dinámica. Conservación del momento angular. Aplicación al movimiento de los astros.', 'fisica', 6),
('TEMA-07', 'Dinámica de un sistema de partículas. Momentos lineal y angular. Principios de conservación. Energía de un sistema de partículas. Relación trabajo-energía.', 'fisica', 7),
('TEMA-08', 'El problema de la posición de la Tierra en el Universo. Sistemas geocéntrico y heliocéntrico. Teoría de la gravitación universal. Aplicaciones. Importancia histórica de la unificación de la gravitación terrestre y celeste.', 'fisica', 8),
('TEMA-09', 'Estática de los cuerpos rígidos. Condiciones de equilibrio. Máquinas. Influencia en el desarrollo social.', 'fisica', 9),
('TEMA-10', 'Estática de fluidos. Presión atmosférica. Diversos planteamientos en la historia de la ciencia sobre el vacío. Métodos para el estudio experimental de la presión.', 'fisica', 10),
('TEMA-11', 'Dinámica de fluidos. La ecuación de continuidad. La ecuación de Bernoulli. Régimen laminar y turbulento. Aplicaciones a dispositivos tecnológicos de interés y al funcionamiento del sistema cardiovascular humano.', 'fisica', 11),
('TEMA-12', 'Gases ideales. Un modelo interpretativo para los gases, teoría cinética. Desviaciones respecto del comportamiento ideal: gases reales. Un modelo para toda la materia. Intercambios energéticos en los cambios de estado.', 'fisica', 12),
('TEMA-13', 'Física de la atmósfera. Fenómenos atmosféricos. Observación meteorológica. Balance energético terrestre. Papel protector de la atmósfera. Alteraciones debidas a la contaminación. Medidas para su protección.', 'fisica', 13),
('TEMA-14', 'La energía y su transferencia. Relación trabajo-energía. Principio de conservación de la energía. Evolución en las necesidades energéticas de la sociedad. Repercusiones medioambientales. Energías alternativas.', 'fisica', 14),
('TEMA-15', 'Energía interna. Calor y temperatura. Desarrollo histórico del concepto de calor. Equilibrio térmico. Propagación del calor. Efectos del calor sobre los cuerpos. Conductores y aislantes. Aplicaciones.', 'fisica', 15),
('TEMA-16', 'Calor y trabajo en los procesos termodinámicos. Primera ley de la termodinámica. Aplicación a las máquinas térmicas y a las reacciones químicas. Rendimiento energético.', 'fisica', 16),
('TEMA-17', 'Entropía. Segundo principio de la termodinámica. Cuestiones relacionadas con el segundo principio: orden y desorden, espontaneidad de las reacciones.', 'fisica', 17),
('TEMA-18', 'Ondas en medios elásticos. Energía que transportan. Fenómenos característicos. Principio de superposición. Métodos experimentales para su estudio. El sonido como ejemplo de ondas longitudinales. Contaminación acústica.', 'fisica', 18),
('TEMA-19', 'Naturaleza eléctrica de la materia. Electrostática. Discontinuidad y conservación de la carga. Carácter conservativo del campo electrostático. Estudio energético de la interacción eléctrica.', 'fisica', 19),
('TEMA-20', 'Corriente eléctrica. Circuitos de corriente continua. Conservación de la energía: ley de Ohm. Uso de polímetros.', 'fisica', 20),
('TEMA-21', 'Campo magnético. Carácter no conservativo del campo magnético. Generación de campos magnéticos y efectos sobre cargas en movimiento. Aplicación a dispositivos tecnológicos.', 'fisica', 21),
('TEMA-22', 'Campos eléctricos y magnéticos dependientes del tiempo. Leyes de Maxwell. Inducción electromagnética. Inducción mutua. Autoinducción.', 'fisica', 22),
('TEMA-23', 'Generación de corrientes alternas. Generadores y motores. Transformadores y transporte de la corriente eléctrica. Influencia de la electricidad en el cambio de las condiciones de vida.', 'fisica', 23),
('TEMA-24', 'Elementos de importancia en los circuitos eléctricos: resistencias, bobinas y condensadores. Su papel en los circuitos de corriente continua y alterna. Energía almacenada o transformada.', 'fisica', 24),
('TEMA-25', 'Ondas electromagnéticas. Origen y propiedades. Energía y cantidad de movimiento en las ondas electromagnéticas. Espectros electromagnéticos. Aplicaciones. Medidas de protección cuando proceda.', 'fisica', 25),
('TEMA-26', 'Óptica geométrica. Principio de Fermat. Formación de imágenes en espejos y lentes. Análisis y construcción de los instrumentos ópticos. El ojo y los defectos de la visión.', 'fisica', 26),
('TEMA-27', 'Óptica física. Propiedades de las ondas luminosas. Observación en el laboratorio. Teoría física del color. Espectrofotometría.', 'fisica', 27),
('TEMA-28', 'Desarrollo histórico de la unificación de la electricidad, el magnetismo y la óptica.', 'general', 28),
('TEMA-29', 'Limitaciones de la física clásica. Mecánica relativista. Postulados de la relatividad especial. Algunas implicaciones de la física relativista.', 'fisica', 29),
('TEMA-30', 'Teoría cuántica. Problemas precursores. Límites de la física clásica para resolverlos. Fenómenos que corroboran la teoría cuántica.', 'fisica', 30),
('TEMA-31', 'Controversia sobre la naturaleza de la luz. Dualidad onda-corpúsculo. Experiencias que la ponen de manifiesto. Interacción radiación-materia. Relaciones de incertidumbre.', 'fisica', 31),
('TEMA-32', 'Sistemas materiales. Mezclas, sustancias puras y elementos. Transformaciones físicas y químicas. Procedimientos de separación de los componentes de una mezcla y de un compuesto. Lenguaje químico: normas IUPAC.', 'quimica', 32),
('TEMA-33', 'Teoría atómica de Dalton. Principio de conservación de la masa. Leyes ponderales y volumétricas. Hipótesis de Avogadro. Estequiometría.', 'quimica', 33),
('TEMA-34', 'Modelos atómicos. Evolución histórica y justificaciones de cada modificación.', 'quimica', 34),
('TEMA-35', 'El núcleo atómico. Modelos. Energía de enlace. Radioactividad natural. Radioactividad artificial. Aplicaciones de la radioactividad en diversos campos. Medidas de seguridad.', 'fisica', 35),
('TEMA-36', 'Fuerzas fundamentales de la naturaleza: gravitatoria, electromagnética, fuerte y débil. Partículas implicadas. Estado actual de las teorías de unificación.', 'general', 36),
('TEMA-37', 'Energía nuclear. Principio de conservación masa-energía. Fisión y fusión nuclear. Su uso. Situación actual. Problemática de los residuos nucleares.', 'fisica', 37),
('TEMA-38', 'Partículas elementales. Estado actual de su estudio. Partículas fundamentales constitutivas del átomo. Del microcosmos al macrocosmos. Teorías sobre la formación y evolución del Universo.', 'fisica', 38),
('TEMA-39', 'Sistema solar. Fenómenos de astronomía de posición. Observación y medida en astrofísica. Evolución estelar. Estructura y composición del Universo.', 'fisica', 39),
('TEMA-40', 'Evolución histórica de la clasificación de los elementos químicos. Periodicidad de las propiedades y relación con la configuración electrónica. Estudio experimental de algunas de las propiedades periódicas.', 'quimica', 40),
('TEMA-41', 'El enlace químico. Aspectos energéticos. Clasificación de los enlaces según la electronegatividad de los átomos que los forman. Estudio del tipo de enlace de acuerdo con las propiedades de las sustancias.', 'quimica', 41),
('TEMA-42', 'Enlace covalente: orbitales moleculares. Diagramas de energía. Geometría molecular. Estructura y propiedades de las sustancias covalentes.', 'quimica', 42),
('TEMA-43', 'Fuerzas intermoleculares. Aspectos energéticos. Sólidos moleculares. Justificación de las propiedades anómalas del agua y su importancia para la vida.', 'quimica', 43),
('TEMA-44', 'Sustancias iónicas. Aspectos energéticos en la formación de cristales iónicos. Reconocimiento y uso de compuestos iónicos.', 'quimica', 44),
('TEMA-45', 'Teoría de bandas. Carácter conductor, semiconductor y aislante de las diferentes sustancias. Superconductividad. Importancia de los semiconductores y superconductores en las nuevas tecnologías.', 'quimica', 45),
('TEMA-46', 'Metales. Características de los diferentes grupos. Obtención y propiedades. Compuestos que originan y aplicaciones. Aleaciones. Interés económico de algunas aleaciones.', 'quimica', 46),
('TEMA-47', 'Elementos no metálicos. Características de los diferentes grupos. Obtención y propiedades. Compuestos que originan y aplicaciones.', 'quimica', 47),
('TEMA-48', 'Elementos de transición. Características y propiedades de los más importantes. Compuestos de coordinación. Teorías sobre su formación.', 'quimica', 48),
('TEMA-49', 'Disoluciones. Leyes de las disoluciones diluidas. Propiedades coligativas. Disoluciones reales. Disoluciones de electrolitos. Estudio experimental del comportamiento eléctrico de un electrolito.', 'quimica', 49),
('TEMA-50', 'Cinética de las reacciones químicas. Teoría de choques moleculares y teoría del estado de transición. Velocidad de reacción y factores de que depende. Métodos prácticos para su determinación.', 'quimica', 50),
('TEMA-51', 'Características de los fenómenos catalíticos y efecto sobre la energía de activación. Aplicaciones en la industria. Naturaleza y propiedades catalíticas de los enzimas.', 'quimica', 51),
('TEMA-52', 'Energía y transformaciones químicas. Ecuaciones termoquímicas. Métodos para el cálculo de calores de reacción.', 'quimica', 52),
('TEMA-53', 'Entropía de un sistema químico. Energía libre de Gibbs y espontaneidad de las reacciones químicas. Relación entre la variación de la energía libre y el equilibrio químico.', 'quimica', 53),
('TEMA-54', 'Equilibrio químico. Constante de equilibrio. Modificaciones externas de los equilibrios. Equilibrios heterogéneos.', 'quimica', 54),
('TEMA-55', 'Ácidos y bases. Teorías. Medidas del pH. Indicadores. Procedimientos para la realización experimental de una curva de valoración ácido-base. Hidrólisis. Soluciones amortiguadoras. Lluvia ácida y contaminación.', 'quimica', 55),
('TEMA-56', 'Ácidos inorgánicos de importancia industrial. Obtención, estructura, propiedades y aplicaciones. Normas de seguridad en el uso y transporte de ácidos.', 'quimica', 56),
('TEMA-57', 'Conceptos de oxidación y reducción. Reacciones redox. Algún proceso redox de interés industrial (pilas y botellas electrolíticas, corrosión y maneras de evitarla, metalurgia y siderurgia).', 'quimica', 57),
('TEMA-58', 'Principales procesos químicos en el agua y en el aire. Influencia en el medio ambiente. El agua, recurso limitado: contaminación y depuración. Procedimientos para determinar la contaminación del agua y del aire.', 'quimica', 58),
('TEMA-59', 'Química del carbono. Estructura y enlaces del carbono. Nomenclatura. Isomería. Comprobación experimental de la actividad óptica.', 'quimica', 59),
('TEMA-60', 'Tipos de reacciones orgánicas. Mecanismos de reacción. Análisis de casos característicos.', 'quimica', 60),
('TEMA-61', 'Métodos usados en la identificación de compuestos orgánicos: análisis cualitativo y cuantitativo. Análisis estructural por métodos espectroscópicos.', 'quimica', 61),
('TEMA-62', 'Hidrocarburos. Características, nomenclatura, obtención y propiedades. Identificación en el laboratorio de alquenos y alquinos.', 'quimica', 62),
('TEMA-63', 'Química del petróleo. Productos derivados y su utilidad en el mundo actual. Contaminación derivada de su uso y normativa vigente. Comparación, en el uso como combustible, con el gas y el carbón.', 'quimica', 63),
('TEMA-64', 'Funciones oxigenadas y nitrogenadas. Características, nomenclatura, obtención y propiedades. Comprobación de sus principales propiedades en el laboratorio. Importancia industrial.', 'quimica', 64),
('TEMA-65', 'Compuestos aromáticos. El benceno: estructura, obtención y propiedades. Otros compuestos aromáticos de interés industrial.', 'quimica', 65),
('TEMA-66', 'Compuestos orgánicos de importancia biológica. Composición química y función biológica. Los alimentos y la salud.', 'quimica', 66),
('TEMA-67', 'Polímeros naturales. Propiedades y aplicaciones. Métodos de obtención de polímeros sintéticos. Uso en el mundo actual y problemas de reciclaje.', 'quimica', 67),
('TEMA-68', 'Las rocas y los minerales fundamentales del relieve español, propiedades e importancia económica. Geomorfología. El modelado del relieve y los factores que lo condicionan. El suelo, componentes, destrucción y recuperación.', 'geologia', 68),
('TEMA-69', 'El origen de la Tierra. Estructura y composición de la Tierra. Las teorías orogénicas. La deriva continental. Interpretación global de los fenómenos geológicos en el marco de la teoría de la tectónica de placas.', 'geologia', 69),
('TEMA-70', 'La Tierra, un planeta en continuo cambio. Los fósiles como indicadores. El tiempo geológico. Explicaciones históricas al problema de los cambios. La evolución, mecanismos y pruebas.', 'geologia', 70),
('TEMA-71', 'El origen de la vida. La teoría celular. La base química de la vida. La célula y sus orgánulos. Las necesidades energéticas, respiración celular y fotosíntesis. La división celular. Los cromosomas y la transmisión de la herencia. Las mutaciones. La sensibilidad celular. Los seres unicelulares.', 'biologia', 71),
('TEMA-72', 'Los seres pluricelulares. La nutrición autótrofa y heterótrofa. La reproducción sexual y asexual. La percepción de estímulos y la elaboración de respuestas. La diversidad de los seres vivos: los grandes modelos de organización de vegetales y animales. Importancia de los animales y plantas en la vida cotidiana.', 'biologia', 72),
('TEMA-73', 'Ecología. Poblaciones, comunidades y ecosistemas. Componentes e interacciones en un ecosistema. Funcionamiento y autorregulación del ecosistema. Los principales problemas ambientales y sus repercusiones políticas, económicas y sociales. La educación ambiental.', 'biologia', 73),
('TEMA-74', 'La salud y la enfermedad. La nutrición y la alimentación humanas. La reproducción y la sexualidad humanas. La relación y la coordinación humanas. La salud mental. Los principales problemas sanitarios de la sociedad actual. Los estilos de vida saludables.', 'biologia', 74),
('TEMA-75', 'El trabajo experimental en el área de ciencias. Uso del laboratorio escolar. Normas de seguridad.', 'general', 75);
