const body = document.getElementById("results");
const historyDiv = document.getElementById("history");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");

let busquedasAnteriores = JSON.parse(localStorage.getItem("busquedas")) || [];
mostrarHistorial();

function mostrarHistorial() {

}

searchButton.addEventListener("click", function() {
    const criterioBusqueda = searchInput.value;
    mostrarCarga();
    buscarEnAPI(criterioBusqueda);
});

searchInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        const criterioBusqueda = searchInput.value;
        if (criterioBusqueda.trim() !== "") {
            mostrarCarga();
            buscarEnAPI(criterioBusqueda);
        } else {
            body.innerHTML = "";
        }
    } else {
        mostrarHistorial();
    }
});

async function buscarEnAPI(criterio) {
    mostrarCarga();

    const name = criterio;
    const apiKey = 'ST86ypj8g/INskI32xtZ9g==baSZI0LnW5EgfCT4';

    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/planets?name=${name}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (data.length === 0) {
                console.log("No se encontraron resultados.");
                body.innerHTML = "No se encontraron resultados.";
            } else {
                console.log("Resultados encontrados:");
                body.innerHTML = data.map(planet => `
                Nombre: ${planet.name},
                Masa: ${planet.mass},
                Radio: ${planet.radius},
                Período Orbital: ${planet.period} días,
                Semieje Mayor: ${planet.semi_major_axis} AU,
                Temperatura: ${planet.temperature} K,
                Distancia en Años Luz: ${planet.distance_light_year},
                Masa de la Estrella Anfitriona: ${planet.host_star_mass} Masa Solar,
                Temperatura de la Estrella Anfitriona: ${planet.host_star_temperature} K
                `).join('<br>');
            }

            if (criterio.trim() !== "") {
                busquedasAnteriores.unshift(criterio);
                localStorage.setItem("busquedas", JSON.stringify(busquedasAnteriores));
            }
            mostrarHistorial();
        } else {
            console.error("Error al obtener los resultados de la API. Código de estado:", response.status);
        }
    } catch (error) {
        console.error("Error al obtener los resultados de la API:", error);
    } finally {
        ocultarCarga();
    }
}

function mostrarCarga() {
    loading.style.display = "block";
}

function ocultarCarga() {
    loading.style.display = "none";
}
