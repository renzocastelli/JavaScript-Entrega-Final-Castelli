const body = document.getElementById("results");

const historyDiv = document.getElementById("history");

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

let busquedasAnteriores = JSON.parse(localStorage.getItem("busquedas")) || [];
mostrarHistorial();

function mostrarHistorial() {
    historyDiv.innerHTML = "Historial de Búsquedas:";
    if (busquedasAnteriores.length > 0) {
        const historialLista = document.createElement("ul");
        busquedasAnteriores.forEach(busqueda => {
            const listItem = document.createElement("li");
            listItem.textContent = busqueda;
            historialLista.appendChild(listItem);
        });
        historyDiv.appendChild(historialLista);
    } else {
        historyDiv.innerHTML += " No hay búsquedas anteriores.";
    }
}

searchButton.addEventListener("click", function() {
    const criterioBusqueda = searchInput.value;
    buscarEnAPI(criterioBusqueda);
});

searchInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        const criterioBusqueda = searchInput.value;
        buscarEnAPI(criterioBusqueda);
    } else {
        mostrarHistorial();
    }
});

async function buscarEnAPI(criterio) {
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
                body.innerHTML = data.map(planet => `Nombre: ${planet.name}, Clima: ${planet.climate}, Terreno: ${planet.terrain}`).join('<br>');
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
    }
}
