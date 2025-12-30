import { supabase } from "./supabaseClient.js";

window.verificar = async function () {
    const num = document.getElementById("num").value;

    const { data } = await supabase
        .from("boletas")
        .select("*")
        .eq("numero", num)
        .single();

    if (!data) {
        document.getElementById("resultado").innerHTML = "No existe.";
        return;
    }

    document.getElementById("resultado").innerHTML = `
        <h3>Boleta #${data.numero_formateado}</h3>
        <p><strong>Estado:</strong> ${data.estado}</p>
        <p><strong>Comprador:</strong> ${data.comprador_nombre || "N/A"}</p>
    `;
};
