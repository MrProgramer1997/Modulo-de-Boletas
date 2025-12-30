import { supabase } from "./supabaseClient.js";

async function cargarAdmin() {
    const { data } = await supabase
        .from("boletas")
        .select("*")
        .order("numero", { ascending: true });

    const div = document.getElementById("boletas-admin");
    div.innerHTML = "";

    data.forEach(b => {
        const row = document.createElement("div");
        row.classList.add("fila-admin");

        row.innerHTML = `
            <span>#${b.numero_formateado}</span>
            <span>${b.estado}</span>
            <span>${b.comprador_nombre || "N/A"}</span>
            <button onclick="pagar('${b.id}')">Marcar pagada</button>
            <button onclick="anular('${b.id}')">Anular</button>
        `;

        div.appendChild(row);
    });
}

window.pagar = async function (id) {
    await supabase.from("boletas").update({ estado: "PAGADA" }).eq("id", id);
    cargarAdmin();
};

window.anular = async function (id) {
    await supabase.from("boletas").update({ estado: "ANULADA" }).eq("id", id);
    cargarAdmin();
};

cargarAdmin();
