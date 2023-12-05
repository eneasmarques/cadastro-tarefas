(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioLogado) {
    document.getElementById("usuario-logado").innerText =
      "Olá, " + usuarioLogado.username;
    atualizaTabela();
  } else {
    window.location.href = "index.html";
  }
});

function sair() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

function salvarTarefa(index) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  let tarefas =
    JSON.parse(localStorage.getItem(`${usuarioLogado.username}.tarefas`)) || [];

  const titulo = document.getElementById("titulo").value;
  const dataInicio = document.getElementById("data-inicio").value;
  const horaInicio = document.getElementById("hora-inicio").value;
  const dataTermino = document.getElementById("data-termino").value;
  const horaTermino = document.getElementById("hora-termino").value;
  const descricao = document.getElementById("descricao").value;

  if (index === null || index === undefined) {
    tarefas.push({
      titulo: titulo,
      dataInicio: dataInicio,
      horaInicio: horaInicio,
      dataTermino: dataTermino,
      horaTermino: horaTermino,
      descricao: descricao,
    });
  } else {
    tarefas[index] = {
      titulo,
      dataInicio,
      horaInicio,
      dataTermino,
      horaTermino,
      descricao,
      realizada: tarefas[index].realizada,
    };
  }

  localStorage.setItem(
    `${usuarioLogado.username}.tarefas`,
    JSON.stringify(tarefas)
  );

  atualizaTabela();
  limpaFormulario();
}

function removerTarefa(index) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  let tarefas =
    JSON.parse(localStorage.getItem(`${usuarioLogado.username}.tarefas`)) || [];

  if (
    index !== null &&
    index !== undefined &&
    index >= 0 &&
    index < tarefas.length
  ) {
    tarefas.splice(index, 1);

    localStorage.setItem(
      `${usuarioLogado.username}.tarefas`,
      JSON.stringify(tarefas)
    );

    atualizaTabela();
    limpaFormulario();
  } else {
    alert(`Índice:${index} da Tarefa é inválido.`);
  }
}

function marcarComoRealizada(index) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  let tarefas =
    JSON.parse(localStorage.getItem(`${usuarioLogado.username}.tarefas`)) || [];

  if (
    index !== null &&
    index !== undefined &&
    index >= 0 &&
    index < tarefas.length
  ) {
    tarefas[index].realizada = !tarefas[index].realizada;

    localStorage.setItem(
      `${usuarioLogado.username}.tarefas`,
      JSON.stringify(tarefas)
    );

    atualizaTabela();
    limpaFormulario();
  } else {
    alert(`Índice:${index} da Tarefa é inválido.`);
  }
}

function atualizaTabela() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const tarefas =
    JSON.parse(localStorage.getItem(`${usuarioLogado.username}.tarefas`)) || [];
  const listaTarefas = document.querySelector("#lista-tarefas");

  listaTarefas.innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const novaLinha = listaTarefas.insertRow();

    const titulo = novaLinha.insertCell(0);
    const dataHoraInicio = novaLinha.insertCell(1);
    const dataHoraTermino = novaLinha.insertCell(2);
    const status = novaLinha.insertCell(3);
    const editar = novaLinha.insertCell(4);

    const linkTitulo = document.createElement("a");
    linkTitulo.href = "#";
    linkTitulo.textContent = tarefa.titulo;

    linkTitulo.addEventListener("click", () => {
      showModal(tarefa.titulo, tarefa.descricao);
    });

    titulo.appendChild(linkTitulo);

    dataHoraInicio.textContent = tarefa.dataInicio + " às " + tarefa.horaInicio;
    dataHoraTermino.textContent =
      tarefa.dataTermino + " às " + tarefa.horaTermino;

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Alterar";
    botaoEditar.id = "btn-editar";
    botaoEditar.className = "btn btn-warning btn";
    botaoEditar.setAttribute("data-index", index);
    botaoEditar.onclick = function () {
      alterarTarefa(index);
    };

    if (tarefa.realizada) {
      btnFinalizar.textContent = "Marcar como não Realizada";
    } else {
      btnFinalizar.textContent = "Marcar como Realizada";
    }

    if (!tarefa.realizada) {
      status.innerHTML = atribuiStatus(
        tarefa.dataInicio,
        tarefa.horaInicio,
        tarefa.dataTermino,
        tarefa.horaTermino
      );
    } else {
      status.innerHTML = '<span class="text-success">Realizada</span>';
    }

    editar.appendChild(botaoEditar);
  });
}

function alterarTarefa(index) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const tarefas =
    JSON.parse(localStorage.getItem(`${usuarioLogado.username}.tarefas`)) || [];

  if (index < 0 || index > tarefas.length) alert("Tarefa não encontrada!");

  const tarefa = tarefas[index];

  const {
    titulo,
    dataInicio,
    horaInicio,
    dataTermino,
    horaTermino,
    descricao,
    realizada,
  } = tarefa;

  document.getElementById("titulo").value = titulo;
  document.getElementById("data-inicio").value = dataInicio;
  document.getElementById("hora-inicio").value = horaInicio;
  document.getElementById("data-termino").value = dataTermino;
  document.getElementById("hora-termino").value = horaTermino;
  document.getElementById("descricao").value = descricao;

  document.getElementById("btnCriar").style.display = "none";
  document.getElementById("botoes-edicao").style.display = "block";

  const btnAlterar = document.querySelector("#btnAlterar");
  btnAlterar.onclick = () => {
    salvarTarefa(index);
  };

  const btnExcluir = document.querySelector("#btnRemover");
  btnExcluir.onclick = () => {
    removerTarefa(index);
  };

  const btnCancelar = document.querySelector("#btnCancelar");
  btnCancelar.onclick = () => {
    limpaFormulario();
  };

  const btnFinalizar = document.querySelector("#btnFinalizar");
  if (realizada) {
    btnFinalizar.textContent = "Marcar como não realizada";
  } else {
    btnFinalizar.textContent = "Marcar como realizada";
  }
  btnFinalizar.onclick = () => {
    marcarComoRealizada(index);
  };
}

function showModal(titulo, descricao) {
  const modal = document.querySelector("#modal-tarefas");
  const tituloModal = document.querySelector(".modal-title");
  const descricaoModal = document.querySelector(".modal-body p");

  tituloModal.textContent = titulo;
  descricaoModal.textContent = descricao;

  const modalTarefa = new bootstrap.Modal(modal);
  modalTarefa.show();
}

function atribuiStatus(dataInicio, horaInicio, dataTermino, horaTermino) {
  const dataAtual = Date.now();
  //   const dataAtual = new Date(date);

  const dataHoraInicio = new Date(`${dataInicio}T${horaInicio}:00`);
  const dataHoraTermino = new Date(`${dataTermino}T${horaTermino}:00`);

  if (dataAtual < dataHoraInicio) {
    return '<span class="text-warning">Pendente</span>';
  }

  if (dataAtual <= dataHoraTermino) {
    return '<span class="text-primary">Andamento</span>';
  }

  if (dataAtual > dataHoraTermino) {
    return '<span class="text-danger">Em atraso</span>';
  }
}

function limpaFormulario() {
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach(function (input) {
    input.value = "";
  });

  document.getElementById("btnCriar").removeAttribute("style");
  document.getElementById("botoes-edicao").style.display = "none";
}
