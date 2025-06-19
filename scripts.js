 // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
        
        // Counter animation
        function animateCounter(elementId, target, duration = 2000) {
            const element = document.getElementById(elementId);
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                element.textContent = Math.floor(current);
            }, 16);
        }
        
        // Start counters when about section is in view
        const aboutSection = document.getElementById('about');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter('years-counter', 5);
                    animateCounter('projects-counter', 14);
                    observer.unobserve(aboutSection);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(aboutSection);
        
        // Form submission
        const contactForm = document.querySelector('form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto!.');
                this.reset();
            });
        }
        //servicios
        const toggleButton = document.getElementById("toggleServices");
        const hiddenCards = document.querySelectorAll(".service-card.hidden");

        let isExpanded = false;

        toggleButton.addEventListener("click", () => {
            isExpanded = !isExpanded;

            hiddenCards.forEach(card => {
            card.classList.toggle("hidden");
            });

            toggleButton.textContent = isExpanded ? "Mostrar menos" : "Ver todos los servicios";
        });

        //proyectos
         const toggleProjectsBtn = document.getElementById("toggleProjects");
        const hiddenProjects = document.querySelectorAll(".project-card.hidden");
        let projectsExpanded = false;

        toggleProjectsBtn.addEventListener("click", () => {
            projectsExpanded = !projectsExpanded;
            hiddenProjects.forEach(card => card.classList.toggle("hidden"));
            toggleProjectsBtn.textContent = projectsExpanded ? "Mostrar menos" : "Ver todos los proyectos";
        });
         //Botón para volver arriba
         // Mostrar el botón al hacer scroll
  window.addEventListener("scroll", () => {
    const btn = document.getElementById("scrollToTopBtn");
    if (window.scrollY > 200) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  });

  // Scroll suave al hacer clic
  document.getElementById("scrollToTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

//CHATBOT
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const chatClose = document.getElementById('chatClose');
const chatContent = document.getElementById('chatContent');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatRestart = document.getElementById('chatRestart');

const servicios = [
  'Pintura y acabados',
  'Instalación de cubiertas',
  'Reparación de techos',
  'Albañilería',
  'Trabajo con madera y herramientas',
  'Reparación de Llamas',
  'Alisados',
  'Instalación de Pladur',
];

const STORAGE_KEY = 'chatbot_history';
let mensajes = [];
let paso = 1;
let esperandoDescripcion = false;
let servicioActual = '';
let serviciosSeleccionados = [];

// --- LocalStorage ---
function cargarHistorial() {
  const historialJSON = localStorage.getItem(STORAGE_KEY);
  if (historialJSON) {
    try {
      return JSON.parse(historialJSON);
    } catch {
      return [];
    }
  }
  return [];
}

function guardarHistorial(mensajes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes));
}

// --- Renderizado ---
function renderizarMensajes() {
  chatContent.innerHTML = '';
  mensajes.forEach(({ tipo, texto }) => {
    const div = document.createElement('div');
    div.className = tipo === 'bot' ? 'bot-message' : 'user-message';
    div.innerText = texto;
    chatContent.appendChild(div);
  });
  chatContent.scrollTop = chatContent.scrollHeight;
}

function agregarMensaje(texto, tipo = 'bot') {
  mensajes.push({ tipo, texto });
  guardarHistorial(mensajes);

  const mensaje = document.createElement('div');
  mensaje.className = tipo === 'bot' ? 'bot-message' : 'user-message';
  mensaje.innerText = texto;
  chatContent.appendChild(mensaje);
  chatContent.scrollTop = chatContent.scrollHeight;
}

// --- Bot "pensando" efecto ---
function agregarPensando() {
  const thinking = document.createElement('div');
  thinking.className = 'bot-message thinking';
  thinking.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  chatContent.appendChild(thinking);
  chatContent.scrollTop = chatContent.scrollHeight;
  return thinking;
}

function quitarPensando(element) {
  if (element) chatContent.removeChild(element);
}

// --- Respuestas ---
async function responder(texto) {
  const thinking = agregarPensando();
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
  quitarPensando(thinking);
  agregarMensaje(texto, 'bot');
}

// --- Mostrar opciones ---
async function mostrarOpciones() {
  let texto = "Por favor, selecciona un servicio escribiendo el número:\n";
  servicios.forEach((s, i) => {
    texto += `${i + 1}. ${s}\n`;
  });
  texto += `\nCuando termines, escribe "listo".`;
  await responder(texto);
}

// --- Reiniciar conversación ---
async function reiniciarConversacion() {
  localStorage.removeItem(STORAGE_KEY);
  mensajes = [];
  paso = 1;
  serviciosSeleccionados = [];
  esperandoDescripcion = false;
  servicioActual = '';
  chatContent.innerHTML = '';
  await responder("🔄 Conversación reiniciada.");
  await responder("¡Hola! Soy el asistente virtual de Cubiertas y más | J. Ortiz. ¿En qué puedo ayudarte?");
  await mostrarOpciones();
  paso = 2;
}

// --- Inicio ---
async function iniciarConversacion() {
  mensajes = cargarHistorial();
  if (mensajes.length === 0) {
    await reiniciarConversacion();
  } else {
    renderizarMensajes();
    paso = 2;
  }
}

// --- Procesar entrada del usuario ---
async function procesarEntrada(input) {
  const texto = input.trim().toLowerCase();
  if (!texto) return;

  agregarMensaje(input, 'user');

  // --- Reinicio ---
  if (texto === 'reiniciar' || texto === 'empezar de nuevo') {
    await reiniciarConversacion();
    return;
  }

  // --- Nombre ---
  const nombreMatch = texto.match(/(?:me llamo|mi nombre es)\s+([a-záéíóúñ\s]+)/i);
  if (nombreMatch) {
    const nombre = nombreMatch[1].trim();
    const campoNombre = document.getElementById('name');
    if (campoNombre) campoNombre.value = nombre;
    await responder(`Encantado, ${nombre}. He guardado tu nombre en el formulario. 😊`);
    const seccionContacto = document.getElementById('contact');
    if (seccionContacto) seccionContacto.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // --- Correo ---
  const correoMatch = texto.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  if (correoMatch) {
    const correo = correoMatch[0];
    const campoEmail = document.getElementById('email');
    if (campoEmail) campoEmail.value = correo;
    await responder(`📧 He añadido tu correo (${correo}) al formulario.`);
    const seccionContacto = document.getElementById('contact');
    if (seccionContacto) seccionContacto.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  // --- Teléfono ---
  const telefonoMatch = texto.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g);
  if (telefonoMatch) {
    const telefono = telefonoMatch[0];
    const campoTelefono = document.getElementById('phone');
    if (campoTelefono) campoTelefono.value = telefono;
    await responder(`📞 He guardado tu número (${telefono}) en el formulario.`);
    const seccionContacto = document.getElementById('contact');
    if (seccionContacto) seccionContacto.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (paso === 1) {
    await mostrarOpciones();
    paso = 2;
    return;
  }

  if (paso === 2) {
    if (esperandoDescripcion) {
      serviciosSeleccionados.push({ servicio: servicioActual, descripcion: input.trim() });
      esperandoDescripcion = false;
      servicioActual = '';
      await responder(`✅ Descripción guardada para el servicio.`);
      await responder(`Puedes seleccionar otro servicio o escribir "listo" para terminar.`);
      return;
    }

    if (texto === 'listo') {
      if (serviciosSeleccionados.length === 0) {
        await responder("Por favor, selecciona al menos un servicio antes de terminar.");
        return;
      }

      let resumen = "Gracias por la información. Aquí tienes un resumen de tus solicitudes:\n\n";
      serviciosSeleccionados.forEach((item, i) => {
        resumen += `${i + 1}. ${item.servicio}:\n   ${item.descripcion}\n\n`;
      });

      await responder(resumen);
      await responder("Puedes contactarnos al teléfono 645 059878 o visitar nuestra web https://j-ortiz-web.netlify.app/ para más detalles.");
      await responder('Si deseas comenzar de nuevo, escribe "reiniciar".');

      const seccionContacto = document.getElementById('contact');
      if (seccionContacto) seccionContacto.scrollIntoView({ behavior: 'smooth' });

      paso = 3;
      return;
    }

    let num = parseInt(texto);
    if (!isNaN(num) && num >= 1 && num <= servicios.length) {
      servicioActual = servicios[num - 1];
      esperandoDescripcion = true;
      await responder(`Has seleccionado: "${servicioActual}". Por favor, descríbeme cuál es el problema o trabajo específico que necesitas con este servicio.`);
    } else {
      await responder('Opción no válida. Por favor, escribe un número de la lista o "listo" para terminar.');
    }
    return;
  }

  if (paso === 3) {
    await responder('Gracias por usar nuestro asistente. Si deseas comenzar de nuevo, escribe "reiniciar".');
  }
}

// --- Eventos ---
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = userInput.value;
  if (input.trim()) {
    userInput.value = '';
    await procesarEntrada(input);
  }
});

chatToggle.addEventListener('click', () => {
  chatBox.style.display = 'flex';
  chatToggle.style.display = 'none';
  userInput.focus();
  iniciarConversacion();
});

chatClose.addEventListener('click', () => {
  chatBox.style.display = 'none';
  chatToggle.style.display = 'flex';
});

chatRestart.addEventListener('click', async () => {
  await reiniciarConversacion();
});
//form send google sheets script
  // const scriptURL = 'https://script.google.com/macros/s/AKfycbxMl5XAocxYAM1yHC9nQ6lHBd5vc_2UJ9T2Z3qsVSyWPjLGfvALhraGeyq4J2f6PgHOKQ/exec'
  // const form = document.forms['moncho-form']

  // form.addEventListener('submit', e => {
  //   e.preventDefault()
  //   fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  //     .then(response => console.log('Success!', response))
  //     .catch(error => console.error('Error!', error.message))
  // })


  /**CONTACT FORM para enviar a google sheets los datos */
const scriptURL = 'https://script.google.com/macros/s/AKfycbxOcPtA9RHX5ubso9qPbYdju6zkqIlx9mHF-ryeqb5klBG0F77X439eI0TOe3mZvPm-/exec'
  const form = document.forms['submit-to-google-sheet']

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: new FormData(form),
      });
  
      if (response.ok) {
        alert('✅ Formulario enviado con éxito.');
        form.reset(); // Limpia el formulario después de enviarlo
      } else {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }
    } catch (error) {
      alert('❌ Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.');
      console.error('Detalles del error:', error);
    }
  });
  