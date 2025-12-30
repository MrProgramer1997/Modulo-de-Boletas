document.addEventListener("DOMContentLoaded", async () => {
  const rifaId = prompt("🔐 Ingresa el ID de la rifa activa:");

  const numeroInicio = 1;
  const numeroFin = 100;

  const boletas = [];

  for (let i = numeroInicio; i <= numeroFin; i++) {
    boletas.push({
      rifa_id: rifaId,
      numero: i,
      numero_formateado: i.toString().padStart(5, '0'),
      estado: 'DISPONIBLE'
    });
  }

  const { data, error } = await supabase
    .from("boletas")
    .insert(boletas);

  if (error) {
    console.error("❌ Error insertando boletas:", error);
    alert("❌ Error insertando boletas: " + error.message);
  } else {
    console.log("✅ Boletas creadas exitosamente:", data);
    alert("✅ Boletas generadas correctamente.");
  }
});
