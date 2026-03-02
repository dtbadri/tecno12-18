(function() {
    console.log("🔧 Iniciando automatización completa de drag & drop (versión corregida)");

    // ===== CONFIGURACIÓN =====
    var notaDeseada = "10,00";
    var tiempoDeseado = "1 min 0 s";
    // =========================

    // Capturar el valor original de ntd (ID de usuario) antes de cualquier modificación
    var ntdOriginal = typeof ntd !== 'undefined' ? ntd : null;
    console.log("📌 ntd original (ID):", ntdOriginal);

    var frameActual = -1;
    var avanzado = false;
    var intervalo = null;

    function resolverFrame() {
        var frame = exportRoot.unidad.currentFrame;
        if (frame === frameActual) return;
        frameActual = frame;
        avanzado = false;
        console.log("🎯 Resolviendo frame", frame);

        var testdg = exportRoot.getChildByName("fotos" + frame);
        if (!testdg) {
            console.error("❌ No se encontró testdg para frame", frame);
            return;
        }

        var hits = null;
        try {
            hits = window['hits' + frame];
            console.log("📋 hits:", hits);
        } catch (e) {}

        if (hits && hits.length) {
            for (var i = 0; i < hits.length; i++) {
                var dragIndex = hits[i][0];
                var fijoIndex = hits[i][1];
                var drag = testdg['drag' + dragIndex];
                var fijo = testdg['fijo' + fijoIndex];
                if (drag && fijo) {
                    drag.x = fijo.x;
                    drag.y = fijo.y;
                    console.log(`   Drag ${dragIndex} → fijo ${fijoIndex}`);
                }
            }
        } else {
            console.warn("⚠️ No se encontraron hits, usando índice por defecto");
            for (var i = 1; i <= 12; i++) {
                var drag = testdg['drag' + i];
                var fijo = testdg['fijo' + i];
                if (drag && fijo) {
                    drag.x = fijo.x;
                    drag.y = fijo.y;
                    console.log(`   Drag ${i} → fijo ${i} (por defecto)`);
                }
            }
        }

        // Restaurar ntd al valor original (ID de usuario)
        if (ntdOriginal !== null) {
            window.ntd = ntdOriginal;
            console.log("🔄 ntd restaurado a", ntdOriginal);
        }

        // Establecer las variables de nota y tiempo
        window.puntuacion = notaDeseada;
        window.nt_o = notaDeseada;
        window.tp_o = tiempoDeseado;

        // Disparar comprobación
        if (testdg.comprueba) {
            testdg.comprueba.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            console.log("✅ Evento de comprobación disparado");
        } else {
            console.warn("⚠️ No hay botón 'comprueba' en este test");
        }
    }

    function avanzarSiTestOk() {
        if (!exportRoot || !exportRoot.interfaz) return;

        var currentLabel = exportRoot.interfaz.currentLabel;
        var frame = exportRoot.unidad.currentFrame;

        if (currentLabel === "testok" && !avanzado) {
            console.log("➡️ Pantalla 'testok' detectada, avanzando manualmente al siguiente frame...");
            if (exportRoot.unidad.currentFrame < exportRoot.unidad.totalFrames - 1) {
                exportRoot.unidad.currentFrame++;
                console.log("Nuevo frame:", exportRoot.unidad.currentFrame);
                if (typeof cargartest === 'function') {
                    cargartest();
                } else {
                    console.warn("cargartest no definida, intentando resolver igualmente");
                }
                avanzado = true;
            } else {
                console.log("Último frame alcanzado, esperando pantalla final...");
            }
        }

        if (frame !== frameActual) {
            resolverFrame();
        }

        if (currentLabel === "finaldinamica") {
            console.log("🏁 Test completado. En pantalla final.");
            // Opcional: detener intervalo
            // clearInterval(intervalo);
        }
    }

    // Pequeño retraso para asegurar carga
    setTimeout(() => {
        resolverFrame();
    }, 1000);

    intervalo = setInterval(avanzarSiTestOk, 1000);

    console.log("✅ Automatización iniciada. El script avanzará por todos los frames automáticamente.");
})();
