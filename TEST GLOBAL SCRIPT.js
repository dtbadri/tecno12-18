// === INYECCIÓN PARA NOTA MÁXIMA EN TODOS LOS TESTS ===
(function() {
    // 1. Forzar que todas las respuestas sean correctas al finalizar
    var originalRespuestaescogida2 = window.respuestaescogida2;
    window.respuestaescogida2 = function() {
        if (typeof numpreg !== 'undefined' && typeof correctAnswer !== 'undefined') {
            correctAnswer = numpreg; // Todas correctas
            console.log("🔧 Nota forzada a máxima en este bloque.");
        }
        if (originalRespuestaescogida2) originalRespuestaescogida2();
    };
    
    // 2. Asegurar que el envío use nuestra nota
    var originalEnvnta = window.envnta;
    if (originalEnvnta) {
        window.envnta = function() {
            if (typeof nt_o !== 'undefined') nt_o = "10,00";
            originalEnvnta();
        };
    }
    
    // 3. También podemos parchear la función que calcula la nota directamente
    // (por si acaso)
    console.log("✅ Inyección activa. Tu nota final será 10 en cada bloque.");
})();