// Seleção de elementos no DOM
const todoForm = document.querySelector("#todo-form"); // Formulário de adição de nova tarefa
const todoList = document.querySelector("#todo-list"); // Lista onde as tarefas serão exibidas
const todoInput = document.querySelector("#todo-input"); // Input de texto para adicionar novas tarefas
const editForm = document.querySelector("#edit-form"); // Formulário para editar uma tarefa
const editInput = document.querySelector("#edit-input"); // Input de texto para editar a tarefa selecionada
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); // Botão para cancelar edição
const searchInput = document.querySelector("#search-input"); // Input de pesquisa de tarefas
const eraseBtn = document.querySelector("#erase-button"); // Botão para limpar a busca
const filterBtn = document.querySelector("#filter-select"); // Filtro de exibição de tarefas (não utilizado no código atual)

let oldInputValue; // Armazena o valor anterior da tarefa para edição

// Função para salvar uma nova tarefa
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo"); // Cria um div para cada tarefa

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text; // Define o título da tarefa como o texto recebido
  todo.appendChild(todoTitle); // Adiciona o título à tarefa

  // Botão de concluir tarefa
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Ícone de "check" para concluir
  todo.appendChild(doneBtn); // Adiciona o botão de conclusão à tarefa

  // Botão de editar tarefa
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'; // Ícone de lápis para edição
  todo.appendChild(editBtn); // Adiciona o botão de edição à tarefa

  // Botão de remover tarefa
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // Ícone de "x" para remoção
  todo.appendChild(deleteBtn); // Adiciona o botão de remoção à tarefa

  // Adiciona a classe "done" se a tarefa já estiver concluída
  if (done) {
    todo.classList.add("done");
  }

  todoList.appendChild(todo); // Adiciona a tarefa completa à lista de tarefas

  // Salva no localStorage
  if (save) {
    saveTodoLocalStorage({ text, done });
  }
};

// Função para alternar entre os formulários de edição e adição
const toggleForms = () => {
  editForm.classList.toggle("hide"); // Oculta/Exibe o formulário de edição
  todoForm.classList.toggle("hide"); // Oculta/Exibe o formulário de adição
  todoList.classList.toggle("hide"); // Oculta/Exibe a lista de tarefas
};

// Função para atualizar o título da tarefa em edição
const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo"); // Seleciona todas as tarefas

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");
    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text; // Atualiza o título da tarefa se coincidir com o valor anterior
    }
  });
};

// Função para filtrar e exibir as tarefas com base na busca
const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase(); // Obtém o título da tarefa e transforma em minúsculas
    const normalizedSearch = search.toLowerCase(); // Normaliza o termo de busca

    todo.style.display = "flex"; // Exibe todas as tarefas por padrão

    // Esconde as tarefas que não correspondem à busca
    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none";
    }
  });
};

// Função para filtrar as tarefas por status (todas, concluídas, pendentes)
const getFilterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
  }
};

// Evento de submit para adicionar uma nova tarefa
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita o comportamento padrão do submit (recarregar a página)

  const inputValue = todoInput.value; // Obtém o valor do input

  if (inputValue) {
    saveTodo(inputValue); // Salva a tarefa se o input não estiver vazio
    todoInput.value = ""; // Limpa o campo após o envio
  }
});

// Evento de clique para concluir, editar ou remover tarefas
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div"); // Encontra o elemento pai mais próximo (tarefa)
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText; // Obtém o título da tarefa clicada
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done"); // Marca ou desmarca a tarefa como concluída
    updateTodoStatusLocalStorage(todoTitle); // Atualiza o status no localStorage
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove(); // Remove a tarefa clicada
    removeTodoLocalStorage(todoTitle); // Remove do localStorage
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms(); // Alterna para o formulário de edição
    editInput.value = todoTitle; // Preenche o input de edição com o título da tarefa
    oldInputValue = todoTitle; // Armazena o valor antigo da tarefa
  }
});

// Evento para cancelar a edição da tarefa
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Evita comportamento padrão do botão
  toggleForms(); // Alterna de volta para o formulário de adição
});

// Evento de submit para confirmar a edição da tarefa
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue); // Atualiza a tarefa com o novo valor
    updateTodoLocalStorage(oldInputValue, editInputValue); // Atualiza o valor no localStorage
  }

  toggleForms(); // Volta para o formulário de adição após editar
});

// Evento para buscar tarefas conforme o usuário digita
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value; // Obtém o valor de busca do input
  getSearchTodos(search); // Filtra as tarefas
});

// Evento para apagar a busca e exibir todas as tarefas novamente
eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = ""; // Limpa o campo de busca
  searchInput.dispatchEvent(new Event("keyup")); // Simula um evento de "keyup" para atualizar a lista de tarefas
});

// Filtro de tarefas (todas, concluídas, pendentes)
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  getFilterTodos(filterValue);
});

// Local Storage Functions

const getTodoLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodoLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoTitle) => {
  const todos = getTodoLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.text !== todoTitle);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoLocalStorage = (oldTitle, newTitle) => {
  const todos = getTodoLocalStorage();
  todos.forEach((todo) => {
    if (todo.text === oldTitle) {
      todo.text = newTitle;
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoStatusLocalStorage = (todoTitle) => {
  const todos = getTodoLocalStorage();
  todos.forEach((todo) => {
    if (todo.text === todoTitle) {
      todo.done = !todo.done;
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Carrega as tarefas do localStorage ao iniciar a página
document.addEventListener("DOMContentLoaded", () => {
  const todos = getTodoLocalStorage();
  todos.forEach((todo) => saveTodo(todo.text, todo.done, 0)); // Passa save = 0 para não duplicar no localStorage
});

