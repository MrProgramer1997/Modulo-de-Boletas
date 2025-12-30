// app.js

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Cargando boletas...");
    await cargarBoletas();
});

async function cargarBoletas() {
    const container = document.getElementById("boletas-container");

    const { data, error } = await supabase
        .from("boletas")
        .select("*")
        .order("numero", { ascending: true });

    if (error) {
        console.error("Error cargando boletas:", error);
        container.innerHTML = "<p>Error cargando boletas.</p>";
        return;
    }

    container.innerHTML = "";

    data.forEach(boleta => {
    const div = document.createElement("div");
    div.classList.add("boleta", boleta.estado.toLowerCase());
    div.textContent = boleta.numero_formateado;

    // 📌 Si está DISPONIBLE → se puede seleccionar
    if (boleta.estado === "DISPONIBLE") {
        div.addEventListener("click", () => seleccionarBoleta(boleta));
    }

    // 📌 Si está RESERVADA → mostrar TIMER y QR
    if (boleta.estado === "RESERVADA") {
        const ahora = new Date();
        const limite = new Date(boleta.reservado_hasta);

        let segundos = Math.floor((limite - ahora) / 1000);

        const timer = document.createElement("div");
        timer.classList.add("timer");

        if (segundos > 0) {
            const intervalo = setInterval(() => {
                segundos--;
                timer.textContent = `⏳ Reserva expira en: ${segundos}s`;

                if (segundos <= 0) {
                    clearInterval(intervalo);
                    location.reload(); // Liberar boleta
                }
            }, 1000);
        }

        // ⭐ GENERAR QR
        const qrImg = document.createElement("img");
        qrImg.src = generarQR(`BOLETA:${boleta.id}`);
        qrImg.classList.add("qr");

        div.appendChild(timer);
        div.appendChild(qrImg);
    }

    container.appendChild(div);
});

}

async function seleccionarBoleta(boleta) {
    const nombre = prompt("Tu nombre:");
    const celular = prompt("Tu celular:");
    const identificacion = prompt("Tu identificación:");
    const email = prompt("Tu correo electrónico:");

    if (!nombre) return;

    const { error } = await supabase
        .from("boletas")
        .update({
            estado: "RESERVADA",
            comprador_nombre: nombre,
            comprador_celular: celular,
            comprador_identificacion: identificacion,
            comprador_email: email,
            reservado_hasta: new Date(Date.now() + 10 * 60 * 1000) // 10 min
        })
        .eq("id", boleta.id);

    if (error) {
        alert("Error al reservar: " + error.message);
        return;
    }

    alert("Boleta reservada exitosamente.");
    location.reload();
}

function generarQR(texto) {
    const qr = new QRious({
        value: texto,
        size: 120
    });
    return qr.toDataURL();
}

