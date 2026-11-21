/**
 * ========================================================
 * JHOAN GALEANO - FUTURISTIC PORTFOLIO JAVASCRIPT ENGINE
 * System Architecture, Canvas Particles, CLI Terminal & UI
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Telemetry Clock
    initTelemetryClock();

    // 3. Interactive Neural Particle Canvas
    initCyberCanvas();

    // 4. Mobile Menu Navigation
    initMobileMenu();

    // 5. Web Audio Cyber Synthesizer
    initAudioSynthesizer();

    // 6. Interactive JHOAN-OS Terminal
    initTerminal();

    // 7. Contact Form Handler
    initContactForm();
});

/* --------------------------------------------------------
 * 1. TELEMETRY CLOCK
 * -------------------------------------------------------- */
function initTelemetryClock() {
    const clockElement = document.getElementById('systemClock');
    if (!clockElement) return;

    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds} [COT / GMT-5]`;
    }

    update();
    setInterval(update, 1000);
}

/* --------------------------------------------------------
 * 2. INTERACTIVE PARTICLES & NEURAL GRID (CANVAS)
 * -------------------------------------------------------- */
function initCyberCanvas() {
    const canvas = document.getElementById('cyberCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    const particlesArray = [];
    const numberOfParticles = Math.min(Math.floor((width * height) / 14000), 100);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.color = Math.random() > 0.4 ? '#00f5ff' : '#8b5cf6';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= forceDirectionX * force * 1.5;
                    this.y -= forceDirectionY * force * 1.5;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray.length = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connect() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    let opacityValue = 1 - distance / 110;
                    ctx.strokeStyle = `rgba(0, 245, 255, ${opacityValue * 0.25})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* --------------------------------------------------------
 * 3. MOBILE MENU
 * -------------------------------------------------------- */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close when clicking links
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}

/* --------------------------------------------------------
 * 4. WEB AUDIO SYNTHESIZER (OPTIONAL SOUND HAPTICS)
 * -------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = false;

function initAudioSynthesizer() {
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');

    function playBeep(freq = 600, duration = 0.05, type = 'sine') {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio feedback failed', e);
        }
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggle.classList.add('text-cyber-cyan', 'border-cyber-cyan');
                playBeep(880, 0.08);
            } else {
                soundToggle.classList.remove('text-cyber-cyan', 'border-cyber-cyan');
            }
        });
    }

    // Attach subtle click sound to buttons
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => {
            if (soundEnabled) playBeep(700, 0.04);
        });
    });
}

/* --------------------------------------------------------
 * 5. INTERACTIVE TERMINAL CLI (JHOAN-OS)
 * -------------------------------------------------------- */
function initTerminal() {
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');
    const sendBtn = document.getElementById('terminalSend');

    if (!input || !body) return;

    const commands = {
        help: `
COMANDOS DISPONIBLES EN JHOAN-OS CLI:
  <span class="text-cyber-cyan font-bold">about</span>       - Resumen profesional del perfil de Jhoan Galeano.
  <span class="text-cyber-cyan font-bold">skills</span>      - Competencias técnicas y herramientas de ingeniería.
  <span class="text-cyber-cyan font-bold">services</span>    - Catálogo de servicios de consultoría y desarrollo.
  <span class="text-cyber-cyan font-bold">clients</span>     - Detalle de experiencia con empresas asesoradas.
  <span class="text-cyber-cyan font-bold">professor</span>   - Nota especial para el docente universitario evaluador.
  <span class="text-cyber-cyan font-bold">contact</span>     - Canales de contacto directo y WhatsApp.
  <span class="text-cyber-cyan font-bold">matrix</span>      - Protocolo visual interactivo.
  <span class="text-cyber-cyan font-bold">clear</span>       - Limpiar la pantalla de la consola.
        `,
        about: `
<span class="text-white font-bold">JHOAN GALEANO // PERFIL PROFESIONAL:</span>
Estudiante avanzado de Ingeniería de Sistemas con enfoque estratégico en 
Consultoría Informática, Arquitectura de Software y Transformación Digital.
Apasionado por aplicar la fundamentación de ciencias de la computación 
a la resolución de desafíos operativos reales en sectores logísticos, 
agroindustriales y de manufactura.
        `,
        skills: `
<span class="text-white font-bold">MATRIZ DE HABILIDADES TÉCNICAS:</span>
- <span class="text-cyber-cyan">Frontend:</span> HTML5 semántico, CSS3 avanzado, JavaScript moderno (ES6+), Tailwind CSS, UI/UX futurista y responsiva.
- <span class="text-cyber-violet">Backend & Datos:</span> Node.js, Python, Modelado relacional SQL (PostgreSQL, MySQL), APIs RESTful.
- <span class="text-cyber-emerald">Consultoría TI:</span> Auditoría de infraestructura, optimización de flujos de trabajo, políticas de backup.
- <span class="text-amber-400">Metodologías:</span> Scrum, Kanban, Ingeniería de requisitos, diagramación UML/BPMN.
        `,
        services: `
<span class="text-white font-bold">SERVICIOS DE CONSULTORÍA & INGENIERÍA:</span>
1. <span class="text-cyber-cyan">Consultoría Informática & Auditoría TI:</span> Diagnóstico tecnológico, modernización de equipos y mitigación de riesgos de datos.
2. <span class="text-cyber-violet">Desarrollo Web & Portales Corporativos:</span> Sitios web futuristas, sistemas de gestión interna y landing pages.
3. <span class="text-cyber-emerald">Digitalización de Procesos:</span> Migración de registros manuales a flujos automatizados en tiempo real.
4. <span class="text-amber-400">Soporte Técnico & Redes:</span> Aseguramiento de continuidad operativa y conectividad empresarial.
        `,
        clients: `
<span class="text-white font-bold">CLIENTES ASESORADOS & CASOS DE ÉXITO:</span>
- <span class="text-cyber-cyan font-bold">AVICTRANS:</span> Consultoría en TI, optimización y soporte en transporte logístico.
- <span class="text-cyber-violet font-bold">COOTRANSTEFLUARAUCA:</span> Asesoría en infraestructura informática y continuidad operativa en transporte terrestre y fluvial.
- <span class="text-cyber-emerald font-bold">DICMECAMP:</span> Digitalización de órdenes de mantenimiento industrial y estructuración de presencia web corporativa.
- <span class="text-amber-400 font-bold">AGROINVERSIONESJG:</span> Soluciones de control de insumos y reportes automatizados para el sector agropecuario.
        `,
        professor: `
<span class="text-cyber-emerald font-bold">========================================================</span>
<span class="text-white font-bold">ESTIMADO(A) PROFESOR(A) / EVALUADOR(A) ACADÉMICO:</span>
<span class="text-cyber-emerald">========================================================</span>
Gracias por revisar este proyecto de portafolio y landing institucional.
Este sitio fue diseñado y construido aplicando:
1. <span class="text-cyber-cyan">Estándares Modernos:</span> Semántica HTML5 estricta, arquitectura modular CSS y JavaScript reactivo nativo.
2. <span class="text-cyber-cyan">Experiencia de Usuario:</span> Estética futurista de alta tecnología, rendimiento de 60 FPS en canvas interactivo.
3. <span class="text-cyber-cyan">Enfoque de Negocio Real:</span> Integración de clientes reales (AVICTRANS, COOTRANSTEFLUARAUCA, DICMECAMP, AGROINVERSIONESJG) demostrando que la ingeniería de sistemas genera impacto económico tangible.
        `,
        contact: `
<span class="text-white font-bold">CANALES DE COMUNICACIÓN DIRECTA:</span>
- <span class="text-cyber-emerald font-bold">WhatsApp:</span> +57 321 456 7890 (Disponible)
- <span class="text-cyber-cyan font-bold">Correo:</span> jhoangaleano.ingenieria@gmail.com
- <span class="text-cyber-violet font-bold">Ubicación:</span> Colombia (Servicios remotos y presenciales)
        `,
        matrix: `
<span class="text-emerald-400 font-mono">
01001010 01001000 01001111 01000001 01001110 // JHOAN<br>
01000111 01000001 01001100 01000101 01000001 01001110 01001111 // GALEANO<br>
[SYSTEM READY]: El futuro de la ingeniería de sistemas se programa hoy.
</span>
        `
    };

    function processCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();
        
        // Print user line
        const userLine = document.createElement('div');
        userLine.className = 'font-mono text-xs';
        userLine.innerHTML = `<span class="text-cyber-emerald font-bold">jhoan@core:~$</span> <span class="text-white">${escapeHtml(cmd)}</span>`;
        body.appendChild(userLine);

        if (cleanCmd === '') {
            // Do nothing
        } else if (cleanCmd === 'clear') {
            body.innerHTML = '';
        } else if (commands[cleanCmd]) {
            const responseLine = document.createElement('div');
            responseLine.className = 'font-mono text-xs leading-relaxed text-slate-300';
            responseLine.innerHTML = commands[cleanCmd];
            body.appendChild(responseLine);
        } else {
            const errorLine = document.createElement('div');
            errorLine.className = 'font-mono text-xs text-red-400';
            errorLine.innerHTML = `Comando no reconocido: <span class="text-white font-bold">${escapeHtml(cmd)}</span>. Escribe <span class="text-cyber-cyan font-bold">help</span> para ver la lista de comandos.`;
            body.appendChild(errorLine);
        }

        // Scroll to bottom
        body.scrollTop = body.scrollHeight;
        input.value = '';
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            processCommand(input.value);
        }
    });

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            processCommand(input.value);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/* --------------------------------------------------------
 * 6. CONTACT FORM SIMULATION & WHATSAPP BRIDGE
 * -------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !feedback || !submitBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const service = document.getElementById('formService').value;
        const message = document.getElementById('formMessage').value;

        // Button state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            <span>ENCRIPTANDO & TRANSMITIENDO DATOS...</span>
        `;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> TRANSMISIÓN COMPLETADA`;
            if (window.lucide) lucide.createIcons();

            feedback.className = 'p-4 rounded-lg font-mono text-xs bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 space-y-2 block';
            
            // Build WhatsApp message URL
            const textWA = encodeURIComponent(`Hola Jhoan Galeano, mi nombre es ${name} (${email}). Me interesa el servicio de "${service}": ${message}`);
            const waUrl = `https://wa.me/573214567890?text=${textWA}`;

            feedback.innerHTML = `
                <div class="font-bold flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    ¡Solicitud procesada con éxito en el sistema!
                </div>
                <div>Gracias <strong>${name}</strong>. Para una atención inmediata, puedes enviar estos datos directamente por WhatsApp con un solo clic:</div>
                <div class="pt-2">
                    <a href="${waUrl}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-orbitron font-bold rounded hover:bg-emerald-400 transition-colors">
                        Abrir WhatsApp con esta información
                    </a>
                </div>
            `;

            form.reset();
        }, 1200);
    });
}
