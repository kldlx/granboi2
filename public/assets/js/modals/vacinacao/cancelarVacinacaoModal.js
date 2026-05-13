document.addEventListener('DOMContentLoaded', () => {
  const modalCancelarVacinacao =
    document.getElementById('modalCancelarVacinacao');

  const formCancelarVacinacao =
    document.getElementById('formCancelarVacinacao');

  const cancelarVacinacaoId =
    document.getElementById('cancelar_vacinacao_id');

  const cancelarVacinacaoAnimal =
    document.getElementById('cancelar_vacinacao_animal');

  const cancelarVacinacaoVacina =
    document.getElementById('cancelar_vacinacao_vacina');

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

  function mostrarMensagemCancelarModal(tipo, mensagem) {
    const messageBox =
      document.getElementById('cancelarVacinacaoModalMessage');

    if (!messageBox) {
      return;
    }

    messageBox.hidden = false;
    messageBox.className = `vacinacao-modal-message ${tipo}`;
    messageBox.innerText = mensagem;
  }

  function limparMensagemCancelarModal() {
    const messageBox =
      document.getElementById('cancelarVacinacaoModalMessage');

    if (!messageBox) {
      return;
    }

    messageBox.hidden = true;
    messageBox.className = 'vacinacao-modal-message';
    messageBox.innerText = '';
  }

  document.querySelectorAll('.cancelar-vacinacao-btn').forEach((button) => {
    button.addEventListener('click', () => {
      limparMensagemCancelarModal();

      if (cancelarVacinacaoId) {
        cancelarVacinacaoId.value = button.dataset.id || '';
      }

      if (cancelarVacinacaoAnimal) {
        cancelarVacinacaoAnimal.innerText = button.dataset.animal || '-';
      }

      if (cancelarVacinacaoVacina) {
        cancelarVacinacaoVacina.innerText = button.dataset.vacina || '-';
      }

      abrirModal(modalCancelarVacinacao);
    });
  });

  document.querySelectorAll('[data-close-modal="modalCancelarVacinacao"]').forEach((elemento) => {
    elemento.addEventListener('click', () => {
      fecharModal(modalCancelarVacinacao);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      fecharModal(modalCancelarVacinacao);
    }
  });

  if (formCancelarVacinacao) {
    formCancelarVacinacao.addEventListener('submit', async (event) => {
      event.preventDefault();

      limparMensagemCancelarModal();

      if (!cancelarVacinacaoId || !cancelarVacinacaoId.value) {
        mostrarMensagemCancelarModal(
          'error',
          'Vacinação não informada.'
        );
        return;
      }

      const submitButton =
        formCancelarVacinacao.querySelector('button[type="submit"]');

      const textoOriginalBotao =
        submitButton ? submitButton.innerText : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = 'Cancelando...';
      }

      try {
        const formData =
          new FormData(formCancelarVacinacao);

        const response =
          await fetch(formCancelarVacinacao.action, {
            method: 'POST',
            body: formData,
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });

        const data =
          await response.json();

        if (!data.sucesso) {
          mostrarMensagemCancelarModal(
            'error',
            data.mensagem || 'Erro ao cancelar vacinação.'
          );
          return;
        }

        mostrarMensagemCancelarModal(
          'success',
          data.mensagem || 'Vacinação cancelada com sucesso.'
        );

        setTimeout(() => {
          window.location.reload();
        }, 700);

      } catch (error) {
        mostrarMensagemCancelarModal(
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