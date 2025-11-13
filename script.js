// ===== PUNTOS DE ENVÍO DE FORMULARIO =====
// ¡Tus URLs de Formspree ya están integradas aquí!
const FORM_ENDPOINT_M1_VF = "https://formspree.io/f/mpwkwwvk"; // Para Módulo 1 (V/F)
const FORM_ENDPOINT_M1_MC = "https://formspree.io/f/mkgkggdy"; // Para Módulo 1 (M.C.)
const FORM_ENDPOINT_M2_VF = "https://formspree.io/f/mvgdggey"; // Para Módulo 2 (V/F)
const FORM_ENDPOINT_M2_MC = "https://formspree.io/f/mrbrbbnw"; // Para Módulo 2 (M.C.)


document.addEventListener('DOMContentLoaded', () => {
    
    // Colores del tema oscuro para los gráficos
    const colorText = '#e2e8f0'; 
    const colorGrid = '#334155'; 
    const colorContainerBg = '#1e293b';

    // --- Lógica de Gráficos ---
    function initDesafioChart() {
        const ctx = document.getElementById('desafioChart');
        if (!ctx) return; // No intentar dibujar si no existe
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
        if (!ctx) return; // No intentar dibujar si no existe
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
    
    // Inicializar gráficos (solo si están en la página actual)
    initDesafioChart();
    initPromptChart();

    
    // --- LÓGICA DE EJERCICIOS (Botón Ver Solución) ---
    // Esta lógica es robusta y funciona para todos los módulos
    const contentScrollArea = document.getElementById('content-scroll-area');
    if (contentScrollArea) {
        contentScrollArea.addEventListener('click', (e) => {
            // Asegurarse de no capturar los botones del quiz (que tienen type="submit")
            if (e.target.classList.contains('ejercicio-toggle-btn') && e.target.type !== 'submit') { 
                e.preventDefault();
                // Esta lógica robusta busca el .info-card más cercano y luego el .ejercicio-solucion dentro de él
                const solucionDiv = e.target.closest('.info-card').querySelector('.ejercicio-solucion');
                if (solucionDiv) {
                    solucionDiv.classList.toggle('hidden');
                    // Cambia el texto del botón entre "Ver Solución..." y "Ocultar Solución"
                    if (solucionDiv.classList.contains('hidden')) {
                        e.target.textContent = e.target.textContent.replace('Ocultar', 'Ver');
                    } else {
                        e.target.textContent = e.target.textContent.replace('Ver', 'Ocultar');
                    }
                }
            }
        });
    }

    // --- LÓGICA DE SCROLL-SPY ---
    const mainNavLinks = document.querySelectorAll("#mainNav a.nav-link");
    const sections = document.querySelectorAll(".view-section");
    const scrollArea = document.getElementById("content-scroll-area");
    
    if (scrollArea && mainNavLinks.length > 0 && sections.length > 0) {
        const observerOptions = {
            root: scrollArea, 
            rootMargin: "0px 0px -60% 0px", 
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

    // --- FUNCIÓN GENÉRICA PARA MOSTRAR RESULTADOS DEL QUIZ ---
    function displayQuizResults(resultsData) {
        const {
            resultsDivId, titleElId, scoreElId, messageElId, feedbackDivId, feedbackListElId,
            score, totalQuestions, incorrectFeedback
        } = resultsData;

        const resultsDiv = document.getElementById(resultsDivId);
        const titleEl = document.getElementById(titleElId);
        const scoreEl = document.getElementById(scoreElId);
        const messageEl = document.getElementById(messageElId);
        const feedbackDiv = document.getElementById(feedbackDivId);
        const feedbackListEl = document.getElementById(feedbackListElId);

        if (!resultsDiv) {
            console.error("Error: No se encontró el div de resultados: ", resultsDivId);
            return; 
        }

        const percentage = (score / totalQuestions) * 100;
        scoreEl.textContent = `${Math.round(percentage)}%`;
        
        let message = "";
        if (percentage === 100) {
            titleEl.textContent = "¡Excelente!";
            message = "Has dominado los conceptos. ¡Gran trabajo!";
            feedbackDiv.classList.add('hidden');
            scoreEl.style.color = "#22c55e"; // Verde
        } else if (percentage >= 80) {
            titleEl.textContent = "¡Muy Bien!";
            message = "Un resultado sólido. Solo necesitas repasar algunos detalles.";
            feedbackDiv.classList.remove('hidden');
            scoreEl.style.color = "#a3e635"; // Lima
        } else if (percentage >= 60) {
            titleEl.textContent = "¡Buen Trabajo! Sigue practicando";
            message = "Esta es una instancia de aprendizaje. Revisa los siguientes temas para reforzar tu conocimiento.";
            feedbackDiv.classList.remove('hidden');
            scoreEl.style.color = "#facc15"; // Amarillo
        } else {
            titleEl.textContent = "Hay que Repasar";
            message = "No te preocupes, esto es el comienzo. Revisa los siguientes temas clave del módulo para afianzar las ideas.";
            feedbackDiv.classList.remove('hidden');
            scoreEl.style.color = "#f87171"; // Rojo
        }
        messageEl.textContent = message;

        // Llenar la lista de feedback
        feedbackListEl.innerHTML = '';
        if (incorrectFeedback.length > 0) {
            incorrectFeedback.forEach(topic => {
                const li = document.createElement('li');
                li.textContent = topic;
                feedbackListEl.appendChild(li);
            });
        } else {
            feedbackDiv.classList.add('hidden');
        }

        // Mostrar y desplazarse a los resultados
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- FUNCIÓN GENÉRICA PARA ENVIAR FORMULARIO ---
    async function sendQuizData(endpoint, formData) {
        try {
            await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            console.log(`Resultados de ${formData.get('quiz_id')} enviados exitosamente.`);
        } catch (error) {
            console.error(`Error al enviar el formulario ${formData.get('quiz_id')}:`, error);
        }
    }

    // --- LÓGICA DE AUTOEVALUACIÓN (V/F - MÓDULO 1) ---
    const quizFormVF1 = document.getElementById('quiz-form-vf');
    if (quizFormVF1) {
        quizFormVF1.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const correctAnswers = {
                q1: 'f', q2: 'v', q3: 'v', q4: 'f', q5: 'v',
                q6: 'v', q7: 'f', q8: 'v', q9: 'f', q10: 'v'
            };
            const feedbackTopics = {
                q1: 'M1: Repasar "Datos Seguros" (Confidencialidad)',
                q2: 'M1: Repasar "10 Aplicaciones" (Calidad del Prompt)',
                q3: 'M1: Repasar "Datos Seguros" (Alucinaciones)',
                q4: 'M1: Repasar "IA en Sistemas" (IA y Excel)',
                q5: 'M1: Repasar "Otras IAs" (ChatPDF)',
                q6: 'M1: Repasar "Inicio del Módulo" (Conversión de Documentos)',
                q7: 'M1: Repasar "10 Aplicaciones" (Optimización de Rutas)',
                q8: 'M1: Repasar "Automatización" (Paso 2)',
                q9: 'M1: Repasar "Datos Seguros" (Usted es el Piloto)',
                q10: 'M1: Repasar "10 Aplicaciones" (Clasificación de Gastos)'
            };

            let score = 0;
            const incorrectFeedback = [];
            const formData = new FormData(quizFormVF1);
            const totalQuestions = Object.keys(correctAnswers).length;

            for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
                if (formData.get(question) === correctAnswer) {
                    score++;
                } else {
                    incorrectFeedback.push(feedbackTopics[question]);
                }
            }

            const dataToSubmit = new FormData(quizFormVF1);
            dataToSubmit.set('puntaje_final_vf', `${(score / totalQuestions) * 100}%`);
            dataToSubmit.set('feedback_vf', incorrectFeedback.join(', '));
            
            sendQuizData(FORM_ENDPOINT_M1_VF, dataToSubmit);
            
            displayQuizResults({
                resultsDivId: 'quiz-results-vf', titleElId: 'quiz-title-vf', scoreElId: 'quiz-score-vf',
                messageElId: 'quiz-message-vf', feedbackDivId: 'quiz-feedback-vf', feedbackListElId: 'quiz-feedback-list-vf',
                score: score, totalQuestions: totalQuestions, incorrectFeedback: incorrectFeedback
            });
        });
    }

    // --- LÓGICA DE AUTOEVALUACIÓN (M.C. - MÓDULO 1) ---
    const quizFormMC1 = document.getElementById('quiz-form-mc');
    if (quizFormMC1) {
        quizFormMC1.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const correctAnswers = {
                mc1: 'b', mc2: 'b', mc3: 'b', mc4: 'b', mc5: 'b',
                mc6: 'a', mc7: 'b', mc8: 'a', mc9: 'a', mc10: 'a'
            };
            const feedbackTopics = {
                mc1: 'M1: Repasar "10 Aplicaciones" (Calidad del Prompt)',
                mc2: 'M1: Repasar "Datos Seguros" (Usted es el Piloto)',
                mc3: 'M1: Repasar "Anotaciones (Clase 1)" (Nuevas Herramientas)',
                mc4: 'M1: Repasar "Datos Seguros" (Confidencialidad)',
                mc5: 'M1: Repasar "Datos Seguros" (Alucinaciones)',
                mc6: 'M1: Repasar "Automatización" (Paso 2)',
                mc7: 'M1: Repasar "Otras IAs" (Gamma.ai)',
                mc8: 'M1: Repasar "Automatización" (Paso 1)',
                mc9: 'M1: Repasar "Anotaciones (Clase 1)" (Seguridad)',
                mc10: 'M1: Repasar "Inicio del Módulo" (El Hábito Clave)'
            };

            let score = 0;
            const incorrectFeedback = [];
            const formData = new FormData(quizFormMC1);
            const totalQuestions = Object.keys(correctAnswers).length;

            for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
                if (formData.get(question) === correctAnswer) {
                    score++;
                } else {
                    incorrectFeedback.push(feedbackTopics[question]);
                }
            }
            
            const dataToSubmit = new FormData(quizFormMC1);
            dataToSubmit.set('puntaje_final_mc', `${(score / totalQuestions) * 100}%`);
            dataToSubmit.set('feedback_mc', incorrectFeedback.join(', '));

            sendQuizData(FORM_ENDPOINT_M1_MC, dataToSubmit);

            displayQuizResults({
                resultsDivId: 'quiz-results-mc', titleElId: 'quiz-title-mc', scoreElId: 'quiz-score-mc',
                messageElId: 'quiz-message-mc', feedbackDivId: 'quiz-feedback-mc', feedbackListElId: 'quiz-feedback-list-mc',
                score: score, totalQuestions: totalQuestions, incorrectFeedback: incorrectFeedback
            });
        });
    }

    // --- LÓGICA DE AUTOEVALUACIÓN (V/F - MÓDULO 2) ---
    const quizFormM2VF = document.getElementById('quiz-form-m2-vf');
    if (quizFormM2VF) {
        quizFormM2VF.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const correctAnswers = {
                'm2-q1': 'v', 'm2-q2': 'f', 'm2-q3': 'v', 'm2-q4': 'f',
                'm2-q5': 'v', 'm2-q6': 'f', 'm2-q7': 'f', 'm2-q8': 'v'
            };
            const feedbackTopics = {
                'm2-q1': 'M2: Repasar "Extracción (Tango/Excel)"',
                'm2-q2': 'M2: Repasar "Reportes y Flujogramas" (Gamma es para visuales)',
                'm2-q3': 'M2: Repasar "Tips Prácticos (BI)" (Tip 1: GIGO)',
                'm2-q4': 'M2: Repasar "Flujo: PDF a Excel" (Paso 1: Seguridad)',
                'm2-q5': 'M2: Repasar "Flujo: PDF a Excel" (Paso 3: Verificación)',
                'm2-q6': 'M2: Repasar "Tips Prácticos (BI)" (Tip 3: Habla en Español)',
                'm2-q7': 'M2: Repasar "Universo de Herramientas" (Análisis Predictivo)',
                'm2-q8': 'M2: Repasar "Anotaciones (Clase 2)" (Qué es RPA)'
            };

            let score = 0;
            const incorrectFeedback = [];
            const formData = new FormData(quizFormM2VF);
            const totalQuestions = Object.keys(correctAnswers).length;

            for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
                if (formData.get(question) === correctAnswer) {
                    score++;
                } else {
                    incorrectFeedback.push(feedbackTopics[question]);
                }
            }

            const dataToSubmit = new FormData(quizFormM2VF);
            dataToSubmit.set('puntaje_final_vf', `${(score / totalQuestions) * 100}%`);
            dataToSubmit.set('feedback_vf', incorrectFeedback.join(', '));
            
            sendQuizData(FORM_ENDPOINT_M2_VF, dataToSubmit);

            displayQuizResults({
                resultsDivId: 'quiz-results-m2-vf', titleElId: 'quiz-title-m2-vf', scoreElId: 'quiz-score-m2-vf',
                messageElId: 'quiz-message-m2-vf', feedbackDivId: 'quiz-feedback-m2-vf', feedbackListElId: 'quiz-feedback-list-m2-vf',
                score: score, totalQuestions: totalQuestions, incorrectFeedback: incorrectFeedback
            });
        });
    }

    // --- LÓGICA DE AUTOEVALUACIÓN (M.C. - MÓDULO 2) ---
    const quizFormM2MC = document.getElementById('quiz-form-m2-mc');
    if (quizFormM2MC) {
        quizFormM2MC.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const correctAnswers = {
                'mc1': 'b', 'mc2': 'a', 'mc3': 'c', 'mc4': 'b', 'mc5': 'a',
                'mc6': 'b', 'mc7': 'a', 'mc8': 'b', 'mc9': 'b', 'mc10': 'b'
            };
            const feedbackTopics = {
                'mc1': 'M2: Repasar "Flujo: PDF a Excel" (Paso 2: "Extrae" vs "Convierte")',
                'mc2': 'M2: Repasar "Anotaciones (Clase 2)" (Un Usuario por Área)',
                'mc3': 'M2: Repasar "Universo de Herramientas" (Julius.ai)',
                'mc4': 'M2: Repasar "Tips Prácticos (BI)" (Tip 3: Habla en Español)',
                'mc5': 'M2: Repasar "Flujo: PDF a Excel" (Paso 1: "Anonimizar")',
                'mc6': 'M2: Repasar "Anotaciones (Clase 2)" (Qué es RPA)',
                'mc7': 'M2: Repasar "Universo de Herramientas" (Perplexity.ai)',
                'mc8': 'M2: Repasar "Tips Prácticos (BI)" (Tip 4: Itera tu Prompt)',
                'mc9': 'M2: Repasar "Flujo: PDF a Excel" (Paso 3: Verificación)',
                'mc10': 'M2: Repasar "Anotaciones (Clase 2)" (Caso Vencimientos)'
            };

            let score = 0;
            const incorrectFeedback = [];
            const formData = new FormData(quizFormM2MC);
            const totalQuestions = Object.keys(correctAnswers).length;

            for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
                if (formData.get(question) === correctAnswer) {
                    score++;
                } else {
                    incorrectFeedback.push(feedbackTopics[question]);
                }
            }

            const dataToSubmit = new FormData(quizFormM2MC);
            dataToSubmit.set('puntaje_final_mc', `${(score / totalQuestions) * 100}%`);
            dataToSubmit.set('feedback_mc', incorrectFeedback.join(', '));
            
            sendQuizData(FORM_ENDPOINT_M2_MC, dataToSubmit);

            displayQuizResults({
                resultsDivId: 'quiz-results-m2-mc', titleElId: 'quiz-title-m2-mc', scoreElId: 'quiz-score-m2-mc',
                messageElId: 'quiz-message-m2-mc', feedbackDivId: 'quiz-feedback-m2-mc', feedbackListElId: 'quiz-feedback-list-m2-mc',
                score: score, totalQuestions: totalQuestions, incorrectFeedback: incorrectFeedback
            });
        });
    }

});
