// Para acceder a los elementos del HTML ya no usamos document.getElementById —
// usamos document.querySelector, que acepta cualquier selector CSS (#id, .clase,
// etiqueta...) y no solo ids. Por ejemplo: document.querySelector("#filtro-nombre").

async function obtenerPersonajes() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const datos = await respuesta.json();
  return datos.results;
}

function filtrarPorEstado(personajes, estado) {
  return estado ? personajes.filter(function (personaje) {
    return personaje.status.toLowerCase() === estado;
  }) : personajes;
}

function filtrarPorEspecie(personajes, especie) {
  return especie ? personajes.filter(function (personaje) {
    return personaje.species === especie;
  }) : personajes;
}

function obtenerNombres(personajes) {
  return personajes.map(function (personaje) {
    return personaje.name;
  });
}

function buscarPorNombre(personajes, nombre) {
  return nombre ? personajes.find(function (personaje) {
    return personaje.name === nombre;
  }) : personajes;
}

function hayPersonajesMuertos(personajes) {
  return personajes.some(function (personaje) {
    return personaje.status === "Dead";
  });
}

function todosVivos(personajes) {
  return personajes.every(function (personaje) {
    return personaje.status === "Alive";
  });
}

function ordenarPorNombre(personajes) {
  return [...personajes].sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function primeros(personajes, cantidad) {
  return cantidad ? personajes.slice(0,cantidad) : personajes;
}

function posicionDeNombre(nombres, nombre) {
  return nombre ? nombres.indexOf(nombre) : nombres;
}

function contarVivos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Alive" ? total+1 : total;
  }, 0);
}

let personajes = [];
let ordenar = false;

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;
  const checkbox = document.querySelector("#checkbox")

  let filtrados = filtrarPorEstado(personajes, estado);
  filtrados = filtrarPorEspecie(filtrados, especie);
  filtrados = filtrados.filter(function (personaje) {
    return personaje.name.toLowerCase().includes(nombre);
  });

  if (checkbox.checked) filtrados = primeros(filtrados,10);
  if (ordenar) filtrados = ordenarPorNombre(filtrados);

  pintarResultados(filtrados);
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");
  document.querySelector("#contador").textContent = lista.length + " personajes encontrados";

  contenedor.innerHTML = lista
    .map(function (personaje) {
      return (
        '<article class="personaje-card">' +
        '<img src="' + personaje.image + '" alt="' + personaje.name + '" />' +
        "<h3>" + personaje.name + "</h3>" +
        "<p>" + personaje.status + " · " + personaje.species + "</p>" +
        "</article>"
      );
    })
    .join("");
}

document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);
document.querySelector("#checkbox").addEventListener("change",aplicarFiltros);
document.querySelector("#boton-ordenar").addEventListener("click",() => {
  ordenar = true;
  aplicarFiltros();
  ordenar = false;
});
document.querySelector("#filtro").addEventListener("reset", () => {
    setTimeout(() => {
        aplicarFiltros();
    }, 0);
});

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});