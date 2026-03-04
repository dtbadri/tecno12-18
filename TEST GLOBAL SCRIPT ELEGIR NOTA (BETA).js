(function() {
    console.log("🔧 Script de nota personalizada (modo manual)");

    // Parámetros por defecto
    var total = typeof numpreg !== 'undefined' ? numpreg : 98;
    var factor = typeof window.factor !== 'undefined' ? window.factor : 0.33;
    console.log("Total preguntas:", total, "| Factor:", factor);

    // Preguntar al usuario qué quiere hacer
    var opcion = prompt("¿Quieres introducir la nota deseada (N) o el número de aciertos (A)? (N/A)");
    var aciertosNecesarios;
    var notaReal;

    if (opcion && opcion.toUpperCase() === 'N') {
        var notaDeseada = prompt("Introduce la nota deseada (ejemplo: 8,60):");
        if (notaDeseada) {
            var notaNum = parseFloat(notaDeseada.replace(',', '.'));
            if (!isNaN(notaNum)) {
                aciertosNecesarios = Math.round((notaNum * total / 10 + factor * total) / (1 + factor));
                aciertosNecesarios = Math.min(total, Math.max(0, aciertosNecesarios));
                notaReal = (aciertosNecesarios - factor * (total - aciertosNecesarios)) * 10 / total;
                notaReal = notaReal.toFixed(2).replace('.', ',');
                console.log("Para nota", notaDeseada, "se necesitan", aciertosNecesarios, "aciertos. Nota real:", notaReal);
            } else {
                console.error("Nota inválida");
                return;
            }
        } else {
            return;
        }
    } else if (opcion && opcion.toUpperCase() === 'A') {
        var aciertosStr = prompt("Introduce el número de aciertos (0-" + total + "):");
        if (aciertosStr) {
            aciertosNecesarios = parseInt(aciertosStr);
            if (isNaN(aciertosNecesarios) || aciertosNecesarios < 0 || aciertosNecesarios > total) {
                console.error("Número inválido");
                return;
            }
            notaReal = (aciertosNecesarios - factor * (total - aciertosNecesarios)) * 10 / total;
            notaReal = notaReal.toFixed(2).replace('.', ',');
            console.log("Con", aciertosNecesarios, "aciertos, la nota será", notaReal);
        } else {
            return;
        }
    } else {
        console.log("Opción no válida. Se usará el valor por defecto (88 aciertos para nota 8,60)");
        aciertosNecesarios = 88; // Valor conocido para 8,60
        notaReal = (aciertosNecesarios - factor * (total - aciertosNecesarios)) * 10 / total;
        notaReal = notaReal.toFixed(2).replace('.', ',');
        console.log("Usando", aciertosNecesarios, "aciertos -> nota", notaReal);
    }

    // Ahora forzamos correctAnswer
    if (typeof respuestaescogida2 === 'function') {
        var originalRespuestaescogida2 = respuestaescogida2;
        window.respuestaescogida2 = function() {
            if (typeof correctAnswer !== 'undefined') {
                correctAnswer = aciertosNecesarios;
                console.log("✅ correctAnswer forzado a", correctAnswer);
            }
            originalRespuestaescogida2();
        };
        console.log("✅ respuestaescogida2 modificada");
    } else {
        console.warn("⚠️ No se encontró respuestaescogida2");
    }

    // Modificar envnta y pantallafinal
    if (typeof envnta === 'function') {
        var originalEnvnta = envnta;
        window.envnta = function() {
            if (typeof nt_o !== 'undefined') nt_o = notaReal;
            if (typeof ntd !== 'undefined') ntd = notaReal;
            if (typeof tp_o !== 'undefined') tp_o = prompt("Tiempo deseado (ej: 1 min 0 s)?", "1 min 0 s") || "1 min 0 s";
            originalEnvnta();
        };
        console.log("✅ envnta modificada");
    }

    if (typeof pantallafinal === 'function') {
        var originalPantalla = pantallafinal;
        window.pantallafinal = function() {
            if (typeof nt_o !== 'undefined') nt_o = notaReal;
            if (typeof tp_o !== 'undefined') tp_o = tp_o; // ya se habrá puesto
            originalPantalla();
        };
        console.log("✅ pantallafinal modificada");
    }

    console.log("✅ Inyección completada. Al finalizar, la nota será", notaReal);
})();
