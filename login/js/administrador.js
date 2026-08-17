```javascript
/* =========================================================
   CLÍNICA VIDA+
   ADMINISTRADOR.JS
   ========================================================= */


/* =========================================================
   USUÁRIO LOGADO
========================================================= */

const usuarioLogado =
    JSON.parse(
        localStorage.getItem("usuarioLogado")
    );


/* =========================================================
   PROTEÇÃO DAS PÁGINAS ADMINISTRATIVAS
========================================================= */

if (
    !usuarioLogado ||
    usuarioLogado.tipo !== "administrador"
) {

    window.location.href = "../login.html";

}


/* =========================================================
   ELEMENTOS
========================================================= */

const profileName =
    document.getElementById("profileName");

const profileAvatar =
    document.getElementById("profileAvatar");

const currentDate =
    document.getElementById("currentDate");

const currentTime =
    document.getElementById("currentTime");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================================================
   INICIAIS DO NOME
========================================================= */

function gerarIniciais(nome) {

    if (!nome) {
        return "AD";
    }

    return nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (parte) {

            return parte
                .charAt(0)
                .toUpperCase();

        })
        .join("");

}


/* =========================================================
   PERFIL
========================================================= */

function carregarPerfil() {

    if (!usuarioLogado) {
        return;
    }


    if (profileName) {

        profileName.textContent =
            usuarioLogado.nome ||
            "Administrador";

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            gerarIniciais(
                usuarioLogado.nome
            );

    }

}


carregarPerfil();


/* =========================================================
   DATA E HORA
========================================================= */

function atualizarDataHora() {

    const agora =
        new Date();


    if (currentDate) {

        currentDate.textContent =
            agora.toLocaleDateString(
                "pt-BR",
                {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    if (currentTime) {

        currentTime.textContent =
            agora.toLocaleTimeString(
                "pt-BR"
            );

    }

}


atualizarDataHora();


setInterval(
    atualizarDataHora,
    1000
);


/* =========================================================
   SAIR
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            const confirmar =
                confirm(
                    "Deseja realmente sair do sistema?"
                );


            if (!confirmar) {
                return;
            }


            localStorage.removeItem(
                "usuarioLogado"
            );


            window.location.href =
                "../login.html";

        }
    );

}


/* =========================================================
   BANCO DE USUÁRIOS
========================================================= */

function obterUsuarios() {

    let usuarios =
        JSON.parse(
            localStorage.getItem(
                "clinicaUsuarios"
            )
        ) || [];


    if (
        usuarios.length === 0
    ) {

        usuarios =
            JSON.parse(
                localStorage.getItem(
                    "usuarios"
                )
            ) || [];

    }


    return usuarios;

}


/* =========================================================
   SALVAR USUÁRIOS
========================================================= */

function salvarUsuarios(usuarios) {

    localStorage.setItem(
        "clinicaUsuarios",
        JSON.stringify(
            usuarios
        )
    );


    localStorage.setItem(
        "usuarios",
        JSON.stringify(
            usuarios
        )
    );

}


/* =========================================================
   NORMALIZAR PERFIL
========================================================= */

function normalizarPerfil(perfil) {

    const valor =
        String(
            perfil || ""
        )
        .toLowerCase()
        .trim();


    if (
        valor === "admin" ||
        valor === "administrador"
    ) {

        return "administrador";

    }


    if (
        valor === "medico" ||
        valor === "médico"
    ) {

        return "medico";

    }


    if (
        valor === "recepcionista"
    ) {

        return "recepcionista";

    }


    if (
        valor === "paciente"
    ) {

        return "paciente";

    }


    return valor;

}


/* =========================================================
   TEXTO DO PERFIL
========================================================= */

function nomePerfil(perfil) {

    perfil =
        normalizarPerfil(
            perfil
        );


    switch (perfil) {

        case "administrador":
            return "Administrador";

        case "medico":
            return "Médico";

        case "recepcionista":
            return "Recepcionista";

        case "paciente":
            return "Paciente";

        default:
            return "Usuário";

    }

}


/* =========================================================
   CRIAR USUÁRIO
========================================================= */

function criarUsuario(dados) {

    const usuarios =
        obterUsuarios();


    const novoUsuario = {

        id:
            dados.id ||
            Date.now().toString(),

        nome:
            dados.nome ||
            "",

        email:
            dados.email ||
            "",

        usuario:
            dados.usuario ||
            dados.email ||
            "",

        senha:
            dados.senha ||
            "",

        tipo:
            normalizarPerfil(
                dados.tipo
            ),

        status:
            dados.status ||
            "Ativo"

    };


    usuarios.push(
        novoUsuario
    );


    salvarUsuarios(
        usuarios
    );


    return novoUsuario;

}


/* =========================================================
   EDITAR USUÁRIO
========================================================= */

function editarUsuario(id, dados) {

    const usuarios =
        obterUsuarios();


    const indice =
        usuarios.findIndex(
            function (usuario) {

                return String(
                    usuario.id
                ) === String(id);

            }
        );


    if (
        indice === -1
    ) {

        return false;

    }


    usuarios[indice] = {

        ...usuarios[indice],

        ...dados,

        tipo:
            normalizarPerfil(
                dados.tipo ||
                usuarios[indice].tipo
            )

    };


    salvarUsuarios(
        usuarios
    );


    return true;

}


/* =========================================================
   EXCLUIR USUÁRIO
========================================================= */

function excluirUsuario(id) {

    const usuarios =
        obterUsuarios();


    if (
        usuarioLogado &&
        String(
            usuarioLogado.id
        ) === String(id)
    ) {

        alert(
            "Você não pode excluir o usuário que está logado."
        );

        return false;

    }


    const novosUsuarios =
        usuarios.filter(
            function (usuario) {

                return String(
                    usuario.id
                ) !== String(id);

            }
        );


    salvarUsuarios(
        novosUsuarios
    );


    return true;

}


/* =========================================================
   MÉDICOS
========================================================= */

function obterMedicos() {

    return (
        JSON.parse(
            localStorage.getItem(
                "medicos"
            )
        ) || []
    );

}


function salvarMedicos(medicos) {

    localStorage.setItem(
        "medicos",
        JSON.stringify(
            medicos
        )
    );

}


/* =========================================================
   PACIENTES
========================================================= */

function obterPacientes() {

    return (
        JSON.parse(
            localStorage.getItem(
                "pacientesCadastrados"
            )
        ) || []
    );

}


function salvarPacientes(pacientes) {

    localStorage.setItem(
        "pacientesCadastrados",
        JSON.stringify(
            pacientes
        )
    );

}


/* =========================================================
   CONSULTAS
========================================================= */

function obterConsultas() {

    return (
        JSON.parse(
            localStorage.getItem(
                "consultas"
            )
        ) || []
    );

}


function salvarConsultas(consultas) {

    localStorage.setItem(
        "consultas",
        JSON.stringify(
            consultas
        )
    );

}


/* =========================================================
   ÚLTIMA CONSULTA
========================================================= */

function obterUltimaConsulta() {

    return (
        JSON.parse(
            localStorage.getItem(
                "ultimaConsulta"
            )
        ) || null
    );

}


/* =========================================================
   ESTATÍSTICAS DO SISTEMA
========================================================= */

function obterEstatisticas() {

    const usuarios =
        obterUsuarios();


    const medicos =
        obterMedicos();


    const pacientes =
        obterPacientes();


    const consultas =
        obterConsultas();


    return {

        usuarios:
            usuarios.length,

        medicos:
            medicos.length,

        pacientes:
            pacientes.length,

        consultas:
            consultas.length

    };

}


/* =========================================================
   ATUALIZAR NÚMERO EM ELEMENTOS
========================================================= */

function atualizarNumero(
    id,
    numero
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            numero;

    }

}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function atualizarDashboard() {

    const estatisticas =
        obterEstatisticas();


    atualizarNumero(
        "totalUsuarios",
        estatisticas.usuarios
    );


    atualizarNumero(
        "totalMedicos",
        estatisticas.medicos
    );


    atualizarNumero(
        "totalPacientes",
        estatisticas.pacientes
    );


    atualizarNumero(
        "totalConsultas",
        estatisticas.consultas
    );

}


atualizarDashboard();


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function configurarNavegacao() {

    const links =
        document.querySelectorAll(
            "nav a"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    links.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );

                }
            );

        }
    );

}


configurarNavegacao();


/* =========================================================
   ESC / FECHAR MODAIS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        const modais =
            document.querySelectorAll(
                ".modal.show"
            );


        modais.forEach(
            function (modal) {

                modal.classList.remove(
                    "show"
                );

            }
        );

    }
);


/* =========================================================
   DISPONIBILIZAR FUNÇÕES GLOBALMENTE
========================================================= */

window.obterUsuarios =
    obterUsuarios;

window.salvarUsuarios =
    salvarUsuarios;

window.criarUsuario =
    criarUsuario;

window.editarUsuario =
    editarUsuario;

window.excluirUsuario =
    excluirUsuario;

window.obterMedicos =
    obterMedicos;

window.salvarMedicos =
    salvarMedicos;

window.obterPacientes =
    obterPacientes;

window.salvarPacientes =
    salvarPacientes;

window.obterConsultas =
    obterConsultas;

window.salvarConsultas =
    salvarConsultas;

window.obterUltimaConsulta =
    obterUltimaConsulta;

window.obterEstatisticas =
    obterEstatisticas;

window.atualizarDashboard =
    atualizarDashboard;
```
