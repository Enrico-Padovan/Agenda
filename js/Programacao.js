document.addEventListener("DOMContentLoaded", function () {
    const btnCadastrarEvento = document.getElementById("btnCadastrarEvento");
    const btnCalendario = document.getElementById("btnCalendario");
    const btnEventosMes = document.getElementById("btnEventosMes");
    const mainContainer = document.getElementById("mainContainer");

    const eventos = [];
    let nextId = 1;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Função para resetar a navbar
    function resetarAtividadeNavbar() {
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            item.classList.remove("active");
        });
    }

    // Função para ativar item da navbar
    function ativarNavbarItem(item) {
        resetarAtividadeNavbar();
        item.classList.add("active");
    }

    // Função para exibir o formulário de cadastro/edição de evento
    function exibirFormularioCadastro(evento = null) {
        const titulo = evento ? "Editar Evento" : "Cadastrar Evento";
        const textoBotao = evento ? "Atualizar Evento" : "Cadastrar";
        const nome = evento ? evento.titulo : "";
        const data = evento ? evento.data : "";
        const hora = evento ? evento.hora : "";
        const descricao = evento ? evento.descricao : "";

        mainContainer.innerHTML = `
            <div class="form-container">
                <h2>${titulo}</h2>
                <form id="formEvento">
                    <input type="text" id="nomeEvento" placeholder="Nome do Evento" value="${nome}" required>
                    <input type="date" id="dataEvento" value="${data}" required>
                    <input type="time" id="horaEvento" value="${hora}" required>
                    <textarea id="informacoesEvento" placeholder="Informações do Evento" rows="4" required>${descricao}</textarea>
                    <button type="submit">${textoBotao}</button>
                </form>
            </div>
        `;

        const form = document.getElementById("formEvento");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (evento) {
                atualizarEvento(evento.id);
            } else {
                cadastrarEvento();
            }
        });
    }

    // Função para cadastrar evento
    function cadastrarEvento() {
        const nomeEvento = document.getElementById("nomeEvento").value;
        const dataEvento = document.getElementById("dataEvento").value;
        const horaEvento = document.getElementById("horaEvento").value;
        const informacoesEvento = document.getElementById("informacoesEvento").value;

        const novoEvento = {
            id: nextId++,
            data: dataEvento,
            titulo: nomeEvento,
            descricao: informacoesEvento,
            hora: horaEvento,
        };

        eventos.push(novoEvento);
        alert("Evento cadastrado com sucesso!");
        exibirCalendario();
    }

    // Função para atualizar um evento
    function atualizarEvento(id) {
        const nomeEvento = document.getElementById("nomeEvento").value;
        const dataEvento = document.getElementById("dataEvento").value;
        const horaEvento = document.getElementById("horaEvento").value;
        const informacoesEvento = document.getElementById("informacoesEvento").value;

        const evento = eventos.find(evento => evento.id === id);
        if (evento) {
            evento.titulo = nomeEvento;
            evento.data = dataEvento;
            evento.hora = horaEvento;
            evento.descricao = informacoesEvento;

            alert("Evento atualizado com sucesso!");
            exibirCalendario();
        }
    }

    // Função para excluir um evento
    function excluirEvento(id) {
        const index = eventos.findIndex(evento => evento.id === id);
        if (index !== -1) {
            eventos.splice(index, 1);
            alert("Evento excluído com sucesso!");
            exibirCalendario();
        }
    }

    // Função para exibir o calendário
    function exibirCalendario() {
        const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const primeiroDia = new Date(currentYear, currentMonth, 1).getDay();
        const diasNoMes = new Date(currentYear, currentMonth + 1, 0).getDate();

        let html = `
            <div class="calendar-header">
                <button onclick="mudarMes(-1)">&#9664;</button>
                <h3>${new Date(currentYear, currentMonth).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h3>
                <button onclick="mudarMes(1)">&#9654;</button>
            </div>
            <div class="calendar-grid">
        `;

        diasSemana.forEach(dia => {
            html += `<div class="header">${dia}</div>`;
        });

        for (let i = 0; i < primeiroDia; i++) {
            html += `<div></div>`;
        }

        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dataAtual = new Date(currentYear, currentMonth, dia).toISOString().split("T")[0];
            const eventoDia = eventos.filter(evento => evento.data === dataAtual);

            html += `
                <div class="calendar-day ${eventoDia.length > 0 ? "event-day" : ""}" data-date="${dataAtual}" onclick="exibirEventosDoDia('${dataAtual}')">
                    ${dia}
                    ${eventoDia.length > 0 ? `<span class="event-indicator">!</span>` : ""}
                </div>
            `;
        }

        html += `</div>`;
        mainContainer.innerHTML = html;
    }

    // Função para mudar o mês do calendário
    window.mudarMes = function (diferenca) {
        currentMonth += diferenca;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        exibirCalendario();
    };

    // Função para exibir eventos de um dia específico
    window.exibirEventosDoDia = function (data) {
        const eventosDoDia = eventos.filter(evento => evento.data === data);

        if (eventosDoDia.length === 0) {
            alert("Nenhum evento para este dia.");
            return;
        }

        let html = `<div class="event-list-container">`;

        eventosDoDia.forEach(evento => {
            html += `
                <div class="event-item">
                    <h3>${evento.titulo}</h3>
                    <p><strong>Data:</strong> ${evento.data}</p>
                    <p><strong>Hora:</strong> ${evento.hora}</p>
                    <p><strong>Descrição:</strong> ${evento.descricao}</p>
                    <button onclick="editarEvento(${evento.id})">Editar</button>
                    <button onclick="excluirEvento(${evento.id})">Excluir</button>
                </div>
            `;
        });

        html += `</div>`;
        mainContainer.innerHTML = html;
    };

    // Função para editar evento
    window.editarEvento = function (id) {
        const evento = eventos.find(evento => evento.id === id);
        if (evento) {
            exibirFormularioCadastro(evento);
        }
    };

    // Função para excluir evento
    window.excluirEvento = function (id) {
        const index = eventos.findIndex(evento => evento.id === id);
        if (index !== -1) {
            eventos.splice(index, 1);
            alert("Evento excluído com sucesso!");
            exibirCalendario();
        }
    };

    // Função para exibir todos os eventos do mês
    function exibirEventosMes() {
        if (eventos.length === 0) {
            alert("Não há eventos para este mês.");
            return;
        }

        let html = `<div class="event-list-container">`;

        eventos.forEach(evento => {
            const eventoData = new Date(evento.data);
            // Verifica se o evento é do mês e ano atual
            if (eventoData.getMonth() === currentMonth && eventoData.getFullYear() === currentYear) {
                html += `
                    <div class="event-item">
                        <h3>${evento.titulo}</h3>
                        <p><strong>Data:</strong> ${evento.data}</p>
                        <p><strong>Hora:</strong> ${evento.hora}</p>
                        <p><strong>Descrição:</strong> ${evento.descricao}</p>
                        <button onclick="editarEvento(${evento.id})">Editar</button>
                        <button onclick="excluirEvento(${evento.id})">Excluir</button>
                    </div>
                `;
            }
        });

        html += `</div>`;
        mainContainer.innerHTML = html;
    }

    // Função de clique do botão de cadastrar evento
    btnCadastrarEvento.addEventListener("click", function () {
        ativarNavbarItem(btnCadastrarEvento);
        exibirFormularioCadastro();
    });

    // Função de clique do botão de calendário
    btnCalendario.addEventListener("click", function () {
        ativarNavbarItem(btnCalendario);
        exibirCalendario();
    });

    // Função de clique do botão de eventos do mês
    btnEventosMes.addEventListener("click", function () {
        ativarNavbarItem(btnEventosMes);
        exibirEventosMes();
    });

    // Exibe o calendário ao carregar
    exibirCalendario();
});
