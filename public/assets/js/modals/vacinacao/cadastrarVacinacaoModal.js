document.addEventListener('DOMContentLoaded', () => {
  const abrirModalCadastrarVacinacao =
    document.getElementById('abrirModalCadastrarVacinacao');

  const modalCadastrarVacinacao =
    document.getElementById('modalCadastrarVacinacao');

  const formCadastrarVacinacao =
    document.getElementById('formCadastrarVacinacao');

  const animalSearch =
    document.getElementById('animal_search');

  const animalIdInput =
    document.getElementById('animal_id');

  const animalStatusInput =
    document.getElementById('animal_status');

  const animalSelecionado =
    document.getElementById('animalSelecionadoVacina');

  const animalWarning =
    document.getElementById('vacinacaoAnimalWarning');

  const animalSearchResults =
    document.getElementById('animalSearchResults');

  const animalOptions =
    document.querySelectorAll('.vacinacao-animal-option');

  const btnSalvarVacinacao =
    document.getElementById('btnSalvarVacinacao');

  function abrirModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.add('active');
  }

  function fecharModal(modal) {
    if (!modal) {
      return;
    }

    modal.classList.remove('active');
  }

  function mostrarMensagemModal(tipo, mensagem) {
    const messageBox =
      document.getElementById('vacinacaoModalMessage');

    if (!messageBox) {
      return;
    }

    messageBox.hidden = false;
    messageBox.className = `vacinacao-modal-message ${tipo}`;
    messageBox.innerText = mensagem;
  }

  function limparMensagemModal() {
    const messageBox =
      document.getElementById('vacinacaoModalMessage');

    if (!messageBox) {
      return;
    }

    messageBox.hidden = true;
    messageBox.className = 'vacinacao-modal-message';
    messageBox.innerText = '';
  }

  function bloquearSalvar() {
    if (!btnSalvarVacinacao) {
      return;
    }

    btnSalvarVacinacao.disabled = true;
  }

  function liberarSalvar() {
    if (!btnSalvarVacinacao) {
      return;
    }

    btnSalvarVacinacao.disabled = false;
  }

  function limparAvisoAnimal() {
    if (!animalWarning) {
      return;
    }

    animalWarning.hidden = true;
    animalWarning.innerText = '';
  }

  function mostrarAvisoAnimal(status) {
    if (!animalWarning) {
      return;
    }

    animalWarning.hidden = false;
    animalWarning.innerText =
      `Não é possível registrar vacinação para animal ${status}. Selecione um animal ativo para continuar.`;
  }

  function limparAnimalSelecionado() {
    if (animalIdInput) {
      animalIdInput.value = '';
    }

    if (animalStatusInput) {
      animalStatusInput.value = '';
    }

    if (animalSelecionado) {
      animalSelecionado.hidden = true;
      animalSelecionado.innerText = '';
    }

    limparAvisoAnimal();
    bloquearSalvar();
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

  function selecionarAnimal(option) {
    const animalId =
      option.dataset.id || '';

    const animalLabel =
      option.dataset.label || '';

    const animalStatus =
      option.dataset.status || '';

    if (animalIdInput) {
      animalIdInput.value = animalId;
    }

    if (animalStatusInput) {
      animalStatusInput.value = animalStatus;
    }

    if (animalSearch) {
      animalSearch.value = animalLabel;
    }

    if (animalSelecionado) {
      animalSelecionado.hidden = false;
      animalSelecionado.innerText = `Animal selecionado: ${animalLabel}`;
    }

    if (animalStatus !== 'ativo') {
      mostrarAvisoAnimal(animalStatus);
      bloquearSalvar();
    } else {
      limparAvisoAnimal();
      liberarSalvar();
    }

    esconderResultadosAnimais();
  }

  if (abrirModalCadastrarVacinacao && modalCadastrarVacinacao) {
    abrirModalCadastrarVacinacao.addEventListener('click', () => {
      limparMensagemModal();

      if (formCadastrarVacinacao) {
        formCadastrarVacinacao.reset();
      }

      if (animalSearch) {
        animalSearch.value = '';
      }

      limparAnimalSelecionado();
      esconderResultadosAnimais();

      animalOptions.forEach((option) => {
        option.hidden = true;
      });

      abrirModal(modalCadastrarVacinacao);
    });
  }

  if (animalSearch) {
    animalSearch.addEventListener('input', () => {
      limparAnimalSelecionado();
      filtrarAnimais(animalSearch.value);
    });

    animalSearch.addEventListener('focus', () => {
      if (animalSearch.value.trim()) {
        filtrarAnimais(animalSearch.value);
      }
    });
  }

  animalOptions.forEach((option) => {
    option.hidden = true;

    option.addEventListener('click', () => {
      selecionarAnimal(option);
    });
  });

  document.addEventListener('click', (event) => {
    const clicouDentroBusca =
      animalSearchResults?.contains(event.target) ||
      animalSearch?.contains(event.target);

    if (!clicouDentroBusca) {
      esconderResultadosAnimais();
    }
  });

  document.querySelectorAll('[data-close-modal="modalCadastrarVacinacao"]').forEach((elemento) => {
    elemento.addEventListener('click', () => {
      fecharModal(modalCadastrarVacinacao);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      fecharModal(modalCadastrarVacinacao);
    }
  });

  if (formCadastrarVacinacao) {
    formCadastrarVacinacao.addEventListener('submit', async (event) => {
      event.preventDefault();

      limparMensagemModal();

      const statusSelecionado =
        animalStatusInput?.value || '';

      if (statusSelecionado && statusSelecionado !== 'ativo') {
        mostrarMensagemModal(
          'error',
          `Não é possível registrar vacinação para animal ${statusSelecionado}.`
        );
        return;
      }

      const erroValidacao =
        validarCadastroVacinacao();

      if (erroValidacao) {
        mostrarMensagemModal('error', erroValidacao);
        return;
      }

      const submitButton =
        formCadastrarVacinacao.querySelector('button[type="submit"]');

      const textoOriginalBotao =
        submitButton ? submitButton.innerText : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = 'Salvando...';
      }

      try {
        const formData =
          new FormData(formCadastrarVacinacao);

        const response =
          await fetch(formCadastrarVacinacao.action, {
            method: 'POST',
            body: formData,
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });

        const data =
          await response.json();

        if (!data.sucesso) {
          mostrarMensagemModal(
            'error',
            data.mensagem || 'Erro ao registrar vacinação.'
          );
          return;
        }

        mostrarMensagemModal(
          'success',
          data.mensagem || 'Vacinação registrada com sucesso.'
        );

        setTimeout(() => {
          window.location.reload();
        }, 700);

      } catch (error) {
        mostrarMensagemModal(
          'error',
          'Erro de comunicação com o servidor. Tente novamente.'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerText = textoOriginalBotao;
        }

        if (animalStatusInput?.value && animalStatusInput.value !== 'ativo') {
          bloquearSalvar();
        }
      }
    });
  }

  bloquearSalvar();
});