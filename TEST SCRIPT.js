// Forzar que todas las respuestas del test actual sean correctas
if (typeof toDisplay !== 'undefined') {
    correctAnswer = toDisplay;
    totalAnswer = toDisplay;
}
// Ir a la pantalla final y enviar la nota
exportRoot.interfaz.gotoAndStop("finaldinamica");
if (exportRoot.interfaz.finaldin) exportRoot.interfaz.finaldin.visible = true;
exportRoot.cargadortest.visible = false;
if (exportRoot.interfaz.cue) exportRoot.interfaz.cue.visible = true;
testvar = true;
if (typeof envnta === 'function') {
    envnta();
    console.log("✅ Nota máxima enviada");
} else {
    console.error("❌ No se encontró la función envnta");
}