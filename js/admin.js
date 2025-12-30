document.addEventListener("DOMContentLoaded", async () => {
  await cargarBoletas();

  document.getElementById("filtro").addEventListener("change", cargarBoletas);
});

async function cargarBoletas() {
  const container = document.getElementById("tabla-boletas");
  const filtro = document.getElementById("filtro").value;

  let query = supabase.from("boletas").select("*").order("numero", { ascending: true });

  if (filtro !== "TODAS") {
    query = query.eq("estado", filtro);
  }

  const { data, error } = await query;

  if (error) {
    container.innerHTML = `<p>Error cargando boletas: ${error.message}</p>`;
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Estado</th>
          <th>Comprador</th>
          <th>Identificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(boleta => {
    html += `
      <tr>
        <td>${boleta.numero_formateado}</td>
        <td>${boleta.estado}</td>
        <td>${boleta.comprador_nombre || "-"}</td>
        <td>${boleta.comprador_identificacion || "-"}</td>
        <td>
          ${boleta.estado !== "PAGADA" ? `<button onclick="marcarComo('PAGADA', '${boleta.id}')">Pagar</button>` : ""}
          ${boleta.estado !== "ANULADA" ? `<button onclick="marcarComo('ANULADA', '${boleta.id}')">Anular</button>` : ""}
          ${boleta.estado !== "DISPONIBLE" ? `<button onclick="marcarComo('DISPONIBLE', '${boleta.id}')">Liberar</button>` : ""}
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

async function marcarComo(nuevoEstado, idBoleta) {
  const confirmacion = confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`);
  if (!confirmacion) return;

  const { error } = await supabase
    .from("boletas")
    .update({ estado: nuevoEstado })
    .eq("id", idBoleta);

  if (error) {
    alert("Error actualizando estado: " + error.message);
  } else {
    alert(`Estado cambiado a ${nuevoEstado}`);
    cargarBoletas();
  }
}
