function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (localStorage.getItem(username) === password) {
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({ username: username })
    );
    window.location.href = "/cadastro-tarefas.html";
  } else {
    document.querySelector("#erro-login").innerText =
      "Usuário ou senha incorretos.";
  }
}

function cadastroUsuario() {
  const novoUsuario = document.getElementById("newUsername").value;
  const novaSenha = document.getElementById("newPassword").value;

  if (localStorage.getItem(novoUsuario)) {
    alert("Usuário já existe. Escolha outro nome de usuário.");
  } else {
    localStorage.setItem(novoUsuario, novaSenha);
    alert("Cadastro realizado com sucesso!");
  }
}

function mostraErro(message) {
  const elementeErro = document.getElementById("errorMessage");
  elementeErro.innerText = message;
}
