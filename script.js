document.addEventListener('DOMContentLoaded', () => {
    
    // Colores del tema oscuro para los gráficos
    const colorText = '#e2e8f0'; 
    const colorGrid = '#334155'; 
    const colorContainerBg = '#1e293b';

    // --- Lógica de Gráficos ---
    function initDesafioChart() {
        const ctx = document.getElementById('desafioChart');
        if (!ctx) return; 
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Tareas Manuales y Repetitivas', 'Tareas de Análisis y Estrategia'],
                datasets: [{ data: [70, 30], backgroundColor: ['#b91c1c', '#16a34a'], borderColor: colorContainerBg, borderWidth: 3 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: colorText } } }
            }
        });
    }

    function initPromptChart() {
        const ctx = document.getElementById('promptChart');
        if (!ctx) return; 
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Contexto', 'Rol', 'Tono', 'Formato', 'Especificidad'],
                datasets: [
                    { label: 'Prompt Básico', data: [2, 1, 1, 1, 2], fill: true, backgroundColor: 'rgba(220, 38, 38, 0.2)', borderColor: 'rgb(220, 38, 38)', pointBackgroundColor: 'rgb(220, 38, 38)' },
                    { label: 'Prompt Efectivo', data: [5, 5, 4, 4, 5], fill: true, backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: 'rgb(56, 189, 248)', pointBackgroundColor: 'rgb(56, 189, 248)' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: colorText } } },
                scales: { r: { beginAtZero: true, max: 5, pointLabels: { font: { size: 14 }, color: colorText }, ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' }, grid: { color: colorGrid }, angleLines: { color: colorGrid } } }
            }
        });
    }
    
    // Inicializar gráficos solo si existen en la página actual
    initDesafioChart();
    initPromptChart();

    
    // --- Lógica de Ejercicios (Botón Ver Solución) ---
    const contentScrollArea = document.getElementById('content-scroll-area');
    if (contentScrollArea) {
        contentScrollArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('ejercicio-toggle-btn')) {
                e.preventDefault();
                // Buscar el div de solución (puede no ser el siguiente hermano directo)
                const solucionDiv = e.target.closest('.info-card').querySelector('.ejercicio-solucion');
                if (solucionDiv) {
                    solucionDiv.classList.toggle('hidden');
                    e.target.textContent = solucionDiv.classList.contains('hidden') ? 'Ver Solución Propuesta' : 'Ocultar Solución';
                }
            }
        });
    }

    // --- LÓGICA DE SCROLL-SPY (para Módulo 1 y 2) ---
    const mainNavLinks = document.querySelectorAll("#mainNav a.nav-link");
    const sections = document.querySelectorAll(".view-section");
    const scrollArea = document.getElementById("content-scroll-area");
    
    if (scrollArea && mainNavLinks.length > 0 && sections.length > 0) {
        const observerOptions = {
            root: scrollArea, // Observa el scroll DENTRO de esta área
            rootMargin: "0px 0px -60% 0px", // Se activa cuando la sección está en el 40% superior
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    mainNavLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // --- NUEVA LÓGICA DE AUTOEVALUACIÓN (QUIZ) ---
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const correctAnswers = {
                q1: 'f', q2: 'v', q3: 'v', q4: 'f', q5: 'v',
                q6: 'v', q7: 'f', q8: 'v', q9: 'f', q10: 'v'
            };

            const feedbackTopics = {
                q1: 'Repasar "Datos Seguros" (Alerta 1: Confidencialidad)',
                q2: 'Repasar "10 Aplicaciones" (Gráfico Calidad del Prompt)',
                q3: 'Repasar "Datos Seguros" (Alerta 2: Alucinaciones)',
                q4: 'Repasar "IA en Sistemas" (IA y Excel)',
                q5: 'Repasar "Otras IAs" (ChatPDF)',
                q6: 'Repasar "Inicio del Módulo" (Conversión de Documentos)',
                q7: 'Repasar "10 Aplicaciones" (Ejemplo 7: Optimización de Rutas)',
                q8: 'Repasar "Automatización" (Paso 2)',
                q9: 'Repasar "Datos Seguros" (Alerta 3: Usted es el Piloto)',
                q10: 'Repasar "10 Aplicaciones" (Ejemplo 4: Clasificación de Gastos)'
            };

            let score = 0;
            const incorrectFeedback = [];
            const formData = new FormData(quizForm);

            for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
                const userAnswer = formData.get(question);
                if (userAnswer === correctAnswer) {
                    score++;
                } else {
                    incorrectFeedback.push(feedbackTopics[question]);
                }
            }

            // Mostrar resultados
            const resultsDiv = document.getElementById('quiz-results');
            const titleEl = document.getElementById('quiz-title');
            const scoreEl = document.getElementById('quiz-score');
            const messageEl = document.getElementById('quiz-message');
            const feedbackDiv = document.getElementById('quiz-feedback');
            const feedbackListEl = document.getElementById('quiz-feedback-list');

            const percentage = (score / 10) * 100;
            scoreEl.textContent = `${percentage}%`;
            
            if (percentage === 100) {
                titleEl.textContent = "¡Excelente!";
                messageEl.textContent = "Has dominado los conceptos fundamentales del Módulo 1. ¡Gran trabajo!";
                feedbackDiv.classList.add('hidden');
                scoreEl.style.color = "#22c55e"; // Verde
            } else if (percentage >= 80) {
                titleEl.textContent = "¡Muy Bien!";
                messageEl.textContent = "Un resultado sólido. Solo necesitas repasar algunos detalles.";
                feedbackDiv.classList.remove('hidden');
                scoreEl.style.color = "#a3e635"; // Lima
            } else if (percentage >= 60) {
                titleEl.textContent = "¡Buen Trabajo! Sigue practicando";
                messageEl.textContent = "Esta es una instancia de aprendizaje. Revisa los siguientes temas para reforzar tu conocimiento.";
                feedbackDiv.classList.remove('hidden');
                scoreEl.style.color = "#facc15"; // Amarillo
            } else {
                titleEl.textContent = "Hay que Repasar";
                messageEl.textContent = "No te preocupes, esto es el comienzo. Revisa los siguientes temas clave del módulo para afianzar las ideas.";
                feedbackDiv.classList.remove('hidden');
                scoreEl.style.color = "#f87171"; // Rojo
            }

            // Llenar la lista de feedback
            feedbackListEl.innerHTML = '';
            incorrectFeedback.forEach(topic => {
                const li = document.createElement('li');
                li.textContent = topic;
                feedbackListEl.appendChild(li);
            });

            // Mostrar y desplazarse a los resultados
            resultsDiv.classList.remove('hidden');
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});
// ===== INICIO: NUEVO CÓDIGO PARA AGREGAR AL FINAL DE script.js =====

// --- LÓGICA DE AUTOEVALUACIÓN (QUIZ MÓDULO 2) ---
const quizFormM2 = document.getElementById('quiz-form-m2');
if (quizFormM2) {
    quizFormM2.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const correctAnswersM2 = {
            'm2-q1': 'v', 'm2-q2': 'f', 'm2-q3': 'v', 'm2-q4': 'f',
            'm2-q5': 'v', 'm2-q6': 'f', 'm2-q7': 'f', 'm2-q8': 'f'
        };

        const feedbackTopicsM2 = {
            'm2-q1': 'Repasar "Extracción (Tango/Excel)" (Limpieza de Crudos)',
            'm2-q2': 'Repasar "Reportes y Flujogramas" y "Otras IAs" (Gamma es para visuales, ChatPDF/GPT-4 para extracción)',
            'm2-q3': 'Repasar "Tips Prácticos (BI)" (Tip 1: GIGO)',
            'm2-q4': 'Repasar "Flujo: PDF a Excel" (Paso 1: Seguridad) y "Datos Seguros" (Módulo 1)',
            'm2-q5': 'Repasar "Flujo: PDF a Excel" (Paso 3: Verificación)',
            'm2-q6': 'Repasar "Tips Prácticos (BI)" (Tip 3: Habla en Español)',
            'm2-q7': 'Repasar "Noticias y Tendencias" (Análisis Predictivo)',
            'm2-q8': 'Repasar "Noticias y Tendencias" (Agentes de IA)'
        };

        let score = 0;
        const incorrectFeedback = [];
        const formData = new FormData(quizFormM2);
        const totalQuestions = Object.keys(correctAnswersM2).length;

        for (const [question, correctAnswer] of Object.entries(correctAnswersM2)) {
            const userAnswer = formData.get(question);
            if (userAnswer === correctAnswer) {
                score++;
            } else {
                incorrectFeedback.push(feedbackTopicsM2[question]);
            }
        }

        // Mostrar resultados
        const resultsDiv = document.getElementById('quiz-results-m2');
        const titleEl = document.getElementById('quiz-title-m2');
        const scoreEl = document.getElementById('quiz-score-m2');
        const messageEl = document.getElementById('quiz-message-m2');
        const feedbackDiv = document.getElementById('quiz-feedback-m2');
        const feedbackListEl = document.getElementById('quiz-feedback-list-m2');

        const percentage = (score / totalQuestions) * 100;
        scoreEl.textContent = `${Math.round(percentage)}%`;
        
        if (percentage === 100) {
            titleEl.textContent = "¡Excelente!";
            messageEl.textContent = "Has dominado los conceptos de este módulo. ¡Listo para automatizar!";
            feedbackDiv.classList.add('hidden');
            scoreEl.style.color = "#22c55e"; // Verde
        } else if (percentage >= 75) {
            titleEl.textContent = "¡Muy Bien!";
            messageEl.textContent = "Un resultado sólido. Solo necesitas repasar algunos detalles clave de análisis.";
            feedbackDiv.classList.remove('hidden');
            scoreEl.style.color = "#a3e635"; // Lima
        } else if (percentage >= 50) {
            titleEl.textContent = "¡Buen Trabajo! Sigue practicando";
            messageEl.textContent = "Esta es una instancia de aprendizaje. Revisa los siguientes temas para reforzar tu conocimiento.";
            feedbackDiv.classList.remove('hidden');
            scoreEl.style.color = "#facc15"; // Amarillo
        } else {
            titleEl.textContent = "Hay que Repasar";
            messageEl.textContent = "No te preocupes. Estos conceptos son complejos. Revisa los siguientes temas clave del módulo.";
            feedbackDiv.classList.remove('hidden');
            scoreEl.style.color = "#f87171"; // Rojo
        }

        // Llenar la lista de feedback
        feedbackListEl.innerHTML = '';
        incorrectFeedback.forEach(topic => {
            const li = document.createElement('li');
            li.textContent = topic;
            feedbackListEl.appendChild(li);
        });

        // Mostrar y desplazarse a los resultados
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// ===== FIN: NUEVO CÓDIGO PARA AGREGAR AL FINAL DE script.js =====