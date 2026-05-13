document.addEventListener('DOMContentLoaded', () => {
  const animalSearch =
    document.getElementById('peso_animal_search');

  const animalIdInput =
    document.getElementById('animal_id');

  const animalSelecionado =
    document.getElementById('pesoAnimalSelecionado');

  const animalSearchResults =
    document.getElementById('pesoAnimalSearchResults');

  const animalOptions =
    document.querySelectorAll('.peso-animal-option');

  const formPesagem =
    document.getElementById('formPesagem');

  const pesoInput =
    document.getElementById('peso');

  const messageBox =
    document.getElementById('pesoFormMessage');

  function mostrarMensagem(tipo, mensagem) {
    if (!messageBox) {
      return;
    }

    messageBox.hidden = false;
    messageBox.className = `peso-form-message ${tipo}`;
    messageBox.innerText = mensagem;
  }

  function limparMensagem() {
    if (!messageBox) {
      return;
    }

    messageBox.hidden = true;
    messageBox.className = 'peso-form-message';
    messageBox.innerText = '';
  }

  function esconderResultadosAnimais() {
    if (animalSearchResults) {
      animalSearchResults.hidden = true;
    }
  }

  function mostrarResultadosAnimais() {
    if (animalSearchResults) {
      animalSearchResults.hidden = false;
    }
  }

  function limparAnimalSelecionado() {
    if (animalIdInput) {
      animalIdInput.value = '';
    }

    if (animalSelecionado) {
      animalSelecionado.hidden = true;
      animalSelecionado.innerText = '';
    }
  }

  function filtrarAnimais(termo) {
    const termoBusca =
      termo.trim().toLowerCase();

    let totalVisivel = 0;

    animalOptions.forEach((option) => {
      const textoBusca =
        option.dataset.search || '';

      const deveMostrar =
        termoBusca.length > 0 &&
        textoBusca.includes(termoBusca);

      option.hidden = !deveMostrar;

      if (deveMostrar) {
        totalVisivel++;
      }
    });

    if (totalVisivel > 0) {
      mostrarResultadosAnimais();
      return;
    }

    esconderResultadosAnimais();
  }

  animalOptions.forEach((option) => {
    option.hidden = true;

    option.addEventListener('click', () => {
      const url =
        option.dataset.url || '';

      if (url) {
        window.location.href = url;
      }
    });
  });

  if (animalSearch) {
    animalSearch.addEventListener('input', () => {
      limparMensagem();

      const valor =
        animalSearch.value;

      if (animalIdInput && animalIdInput.value) {
        limparAnimalSelecionado();
      }

      filtrarAnimais(valor);
    });

    animalSearch.addEventListener('focus', () => {
      if (animalSearch.value.trim()) {
        filtrarAnimais(animalSearch.value);
      }
    });
  }

  document.addEventListener('click', (event) => {
    const clicouDentroBusca =
      animalSearchResults?.contains(event.target) ||
      animalSearch?.contains(event.target);

    if (!clicouDentroBusca) {
      esconderResultadosAnimais();
    }
  });

  if (formPesagem) {
    formPesagem.addEventListener('submit', (event) => {
      limparMensagem();

      const animalId =
        animalIdInput?.value;

      const peso =
        pesoInput?.value;

      if (!animalId) {
        event.preventDefault();
        mostrarMensagem('error', 'Pesquise e selecione um animal antes de registrar a pesagem.');
        return;
      }

      if (!peso) {
        event.preventDefault();
        mostrarMensagem('error', 'Informe o novo peso do animal.');
        return;
      }

      if (Number(peso) <= 0) {
        event.preventDefault();
        mostrarMensagem('error', 'O peso deve ser maior que zero.');
      }
    });
  }
});