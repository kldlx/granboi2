document.addEventListener('DOMContentLoaded', () => {
  const modalReativarVacinacao =
    document.getElementById('modalReativarVacinacao');

  const formReativarVacinacao =
    document.getElementById('formReativarVacinacao');

  const reativarVacinacaoId =
    document.getElementById('reativar_vacinacao_id');

  const reativarVacinacaoAnimal =
    document.getElementById('reativar_vacinacao_animal');

  const reativarVacinacaoVacina =
    document.getElementById('reativar_vacinacao_vacina');

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

  function mostrarMensagemReativarModal(tipo, mensagem) {
    const messageBox =
      document.getElementById('reativarVacinacaoModalMessage');

    if (!messageBox) {
      return;
    }

    messageBox.hidden = false;
    messageBox.className = `vacinacao-modal-message ${tipo}`;
    messageBox.innerText = mensagem;
  }

  function limparMensagemReativarModal() {
    const messageBox =
      document.getElementById('reativarVacinacaoModalMessage');

    if (!messageBox) {
      return;
    }

    messageBox.hidden = true;
    messageBox.className = 'vacinacao-modal-message';
    messageBox.innerText = '';
  }

  document.querySelectorAll('.reativar-vacinacao-btn').forEach((button) => {
    button.addEventListener('click', () => {
      limparMensagemReativarModal();

      if (reativarVacinacaoId) {
        reativarVacinacaoId.value = button.dataset.id || '';
      }

      if (reativarVacinacaoAnimal) {
        reativarVacinacaoAnimal.innerText = button.dataset.animal || '-';
      }

      if (reativarVacinacaoVacina) {
        reativarVacinacaoVacina.innerText = button.dataset.vacina || '-';
      }

      abrirModal(modalReativarVacinacao);
    });
  });

  document.querySelectorAll('[data-close-modal="modalReativarVacinacao"]').forEach((elemento) => {
    elemento.addEventListener('click', () => {
      fecharModal(modalReativarVacinacao);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      fecharModal(modalReativarVacinacao);
    }
  });

  if (formReativarVacinacao) {
    formReativarVacinacao.addEventListener('submit', async (event) => {
      event.preventDefault();

      limparMensagemReativarModal();

      if (!reativarVacinacaoId || !reativarVacinacaoId.value) {
        mostrarMensagemReativarModal(
          'error',
          'Vacinação não informada.'
        );
        return;
      }

      const submitButton =
        formReativarVacinacao.querySelector('button[type="submit"]');

      const textoOriginalBotao =
        submitButton ? submitButton.innerText : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = 'Reativando...';
      }

      try {
        const formData =
          new FormData(formReativarVacinacao);

        const response =
          await fetch(formReativarVacinacao.action, {
            method: 'POST',
            body: formData,
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });

        const data =
          await response.json();

        if (!data.sucesso) {
          mostrarMensagemReativarModal(
            'error',
            data.mensagem || 'Erro ao reativar vacinação.'
          );
          return;
        }

        mostrarMensagemReativarModal(
          'success',
          data.mensagem || 'Vacinação reativada com sucesso.'
        );

        setTimeout(() => {
          window.location.reload();
        }, 700);

      } catch (error) {
        mostrarMensagemReativarModal(
          'error',
          'Erro de comunicação com o servidor. Tente novamente.'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerText = textoOriginalBotao;
        }
      }
    });
  }
});