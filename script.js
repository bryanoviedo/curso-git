// ---------- Datos base ----------

const CATEGORIAS = [
    { id: "primeros-pasos", nombre: "Primeros pasos", descripcion: "Instalación, configuración y conceptos básicos." },
    { id: "comandos", nombre: "Comandos básicos", descripcion: "add, commit, push, pull, status y más." },
    { id: "ramas", nombre: "Ramas y Merge", descripcion: "Branching, merge, rebase y resolución de conflictos." },
    { id: "pull-requests", nombre: "Pull Requests", descripcion: "Cómo abrir, revisar y fusionar PRs." },
    { id: "colaboracion", nombre: "Colaboración", descripcion: "Trabajo en equipo, forks e issues." },
    { id: "actions", nombre: "GitHub Actions", descripcion: "Automatización y flujos de CI/CD." },
    { id: "buenas-practicas", nombre: "Buenas prácticas", descripcion: "Commits claros, .gitignore, convenciones." },
];

const TEMAS_INICIALES = [
    {
        id: "t1",
        titulo: "¿Cuál es la diferencia entre git fetch y git pull?",
        categoria: "comandos",
        autor: "Bryan",
        contenido: "Siempre me confundo, ¿alguien puede explicarlo con un ejemplo sencillo?",
        respuestas: 4,
        likes: 6,
        fecha: "2026-08-20",
    },
    {
        id: "t2",
        titulo: "Cómo resolver un conflicto de merge paso a paso",
        categoria: "ramas",
        autor: "Ana",
        contenido: "Tuve un conflicto al hacer merge entre dos ramas, ¿cuál es el flujo recomendado para resolverlo?",
        respuestas: 7,
        likes: 12,
        fecha: "2026-08-22",
    },
    {
        id: "t3",
        titulo: "Buenas prácticas para escribir mensajes de commit",
        categoria: "buenas-practicas",
        autor: "Carlos",
        contenido: "¿Qué formato usan ustedes? He visto Conventional Commits, ¿vale la pena adoptarlo?",
        respuestas: 5,
        likes: 9,
        fecha: "2026-08-25",
    },
    {
        id: "t4",
        titulo: "Mi primer Pull Request fue rechazado, ¿qué revisar?",
        categoria: "pull-requests",
        autor: "Marta",
        contenido: "El revisor pidió cambios en la descripción y en los tests. ¿Cómo estructuro un buen PR?",
        respuestas: 3,
        likes: 5,
        fecha: "2026-08-28",
    },
    {
        id: "t5",
        titulo: "Configurar un workflow básico con GitHub Actions",
        categoria: "actions",
        autor: "Luis",
        contenido: "Quiero correr los tests automáticamente en cada push a main, ¿por dónde empiezo?",
        respuestas: 2,
        likes: 4,
        fecha: "2026-08-30",
    },
    {
        id: "t6",
        titulo: "¿Fork o rama para colaborar en un proyecto open source?",
        categoria: "colaboracion",
        autor: "Sofía",
        contenido: "No tengo permisos de escritura en el repo, ¿debería hacer fork o pedir acceso?",
        respuestas: 6,
        likes: 8,
        fecha: "2026-09-01",
    },
    {
        id: "t7",
        titulo: "Guía rápida para instalar Git en Windows",
        categoria: "primeros-pasos",
        autor: "Bryan",
        contenido: "Comparto los pasos que seguí para instalar Git Bash y configurar mi usuario global.",
        respuestas: 1,
        likes: 3,
        fecha: "2026-09-03",
    },
];

// ---------- Estado ----------

const STORAGE_KEY_TEMAS = "foro-git-temas-nuevos";
const STORAGE_KEY_LIKES = "foro-git-likes";

let temas = [...cargarTemasGuardados(), ...TEMAS_INICIALES];
let likesGuardados = cargarLikesGuardados();
let filtroActivo = "todos";
let busqueda = "";

function cargarTemasGuardados() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_TEMAS)) || [];
    } catch {
        return [];
    }
}

function guardarTemasNuevos(temasNuevos) {
    localStorage.setItem(STORAGE_KEY_TEMAS, JSON.stringify(temasNuevos));
}

function cargarLikesGuardados() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_LIKES)) || {};
    } catch {
        return {};
    }
}

function guardarLikes() {
    localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likesGuardados));
}

function nombreCategoria(id) {
    const cat = CATEGORIAS.find((c) => c.id === id);
    return cat ? cat.nombre : id;
}

// ---------- Render: Categorías ----------

function renderCategorias() {
    const grid = document.getElementById("categoryGrid");
    grid.innerHTML = "";

    CATEGORIAS.forEach((cat) => {
        const cantidad = temas.filter((t) => t.categoria === cat.id).length;

        const card = document.createElement("div");
        card.className = "category-card";
        card.innerHTML = `
            <h3>${cat.nombre}</h3>
            <p>${cat.descripcion}</p>
            <span class="count">${cantidad} tema${cantidad === 1 ? "" : "s"}</span>
        `;
        card.addEventListener("click", () => {
            filtroActivo = cat.id;
            actualizarFiltrosActivos();
            renderTemas();
            document.getElementById("foro").scrollIntoView({ behavior: "smooth" });
        });

        grid.appendChild(card);
    });
}

// ---------- Render: Filtros ----------

function renderFiltros() {
    const contenedor = document.getElementById("filtros");
    contenedor.innerHTML = "";

    const btnTodos = document.createElement("button");
    btnTodos.className = "filtro-btn active";
    btnTodos.dataset.filtro = "todos";
    btnTodos.textContent = "Todos";
    btnTodos.addEventListener("click", () => {
        filtroActivo = "todos";
        actualizarFiltrosActivos();
        renderTemas();
    });
    contenedor.appendChild(btnTodos);

    CATEGORIAS.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "filtro-btn";
        btn.dataset.filtro = cat.id;
        btn.textContent = cat.nombre;
        btn.addEventListener("click", () => {
            filtroActivo = cat.id;
            actualizarFiltrosActivos();
            renderTemas();
        });
        contenedor.appendChild(btn);
    });
}

function actualizarFiltrosActivos() {
    document.querySelectorAll(".filtro-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filtro === filtroActivo);
    });
}

// ---------- Render: Select de categorías (form) ----------

function renderSelectCategorias() {
    const select = document.getElementById("inputCategoria");
    select.innerHTML = "";
    CATEGORIAS.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.nombre;
        select.appendChild(option);
    });
}

// ---------- Render: Temas ----------

function renderTemas() {
    const lista = document.getElementById("listaTemas");
    const sinResultados = document.getElementById("sinResultados");
    lista.innerHTML = "";

    const filtrados = temas
        .filter((t) => filtroActivo === "todos" || t.categoria === filtroActivo)
        .filter((t) => {
            const texto = (t.titulo + " " + t.contenido).toLowerCase();
            return texto.includes(busqueda.toLowerCase());
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    sinResultados.hidden = filtrados.length !== 0;

    filtrados.forEach((tema) => {
        const likesActuales = tema.likes + (likesGuardados[tema.id] ? 1 : 0);

        const li = document.createElement("li");
        li.className = "tema";
        li.innerHTML = `
            <div class="tema-top">
                <h3>${escapeHtml(tema.titulo)}</h3>
                <span class="tema-tag">${nombreCategoria(tema.categoria)}</span>
            </div>
            <p class="contenido">${escapeHtml(tema.contenido)}</p>
            <div class="tema-meta">
                <span>👤 ${escapeHtml(tema.autor)} · ${tema.fecha} · 💬 ${tema.respuestas} respuestas</span>
                <button class="like-btn ${likesGuardados[tema.id] ? "liked" : ""}" data-id="${tema.id}">
                    👍 <span class="like-count">${likesActuales}</span>
                </button>
            </div>
        `;

        li.querySelector(".like-btn").addEventListener("click", (e) => {
            const btn = e.currentTarget;
            const id = btn.dataset.id;
            likesGuardados[id] = !likesGuardados[id];
            guardarLikes();
            renderTemas();
        });

        lista.appendChild(li);
    });

    actualizarStats();
}

function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// ---------- Stats ----------

function actualizarStats() {
    document.getElementById("statTemas").textContent = temas.length;
    document.getElementById("statRespuestas").textContent = temas.reduce((acc, t) => acc + t.respuestas, 0);
    document.getElementById("statCategorias").textContent = CATEGORIAS.length;
}

// ---------- Nuevo tema ----------

function inicializarFormNuevoTema() {
    const btnNuevo = document.getElementById("btnNuevoTema");
    const form = document.getElementById("formNuevoTema");
    const btnCancelar = document.getElementById("btnCancelarTema");

    btnNuevo.addEventListener("click", () => {
        form.hidden = !form.hidden;
        if (!form.hidden) {
            document.getElementById("inputTitulo").focus();
        }
    });

    btnCancelar.addEventListener("click", () => {
        form.reset();
        form.hidden = true;
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const titulo = document.getElementById("inputTitulo").value.trim();
        const categoria = document.getElementById("inputCategoria").value;
        const contenido = document.getElementById("inputContenido").value.trim();

        if (!titulo || !contenido) return;

        const nuevoTema = {
            id: "u" + Date.now(),
            titulo,
            categoria,
            autor: "Tú",
            contenido,
            respuestas: 0,
            likes: 0,
            fecha: new Date().toISOString().slice(0, 10),
        };

        temas.unshift(nuevoTema);

        const guardados = cargarTemasGuardados();
        guardados.unshift(nuevoTema);
        guardarTemasNuevos(guardados);

        form.reset();
        form.hidden = true;
        filtroActivo = "todos";
        actualizarFiltrosActivos();
        renderCategorias();
        renderTemas();
    });
}

// ---------- Búsqueda ----------

function inicializarBusqueda() {
    const input = document.getElementById("searchInput");
    input.addEventListener("input", (e) => {
        busqueda = e.target.value;
        renderTemas();
    });
}

// ---------- Menú móvil ----------

function inicializarMenu() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");

    toggle.addEventListener("click", () => {
        const abierto = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", abierto);
    });

    nav.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");

            document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

// ---------- Init ----------

function init() {
    renderCategorias();
    renderFiltros();
    renderSelectCategorias();
    renderTemas();
    inicializarFormNuevoTema();
    inicializarBusqueda();
    inicializarMenu();
}

document.addEventListener("DOMContentLoaded", init);
