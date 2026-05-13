document.addEventListener('DOMContentLoaded', () => {
  const modalDetalhesVacinacao =
    document.getElementById('modalDetalhesVacinacao');

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

  function preencherTexto(id, valor) {
    const elemento =
      document.getElementById(id);

    if (!elemento) {
      return;
    }

    elemento.innerText =
      valor && valor.trim() !== '' ? valor : '-';
  }

  function formatarData(data) {
    if (!data) {
      return '-';
    }

    const partes =
      data.split('-');

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  document.querySelectorAll('.detalhes-vacinacao-btn').forEach((button) => {
    button.addEventListener('click', () => {
      preencherTexto(
        'detalhes_vacinacao_animal',
        button.dataset.animal
      );

      preencherTexto(
        'detalhes_vacinacao_vacina',
        button.dataset.vacina
      );

      preencherTexto(
        'detalhes_vacinacao_data_aplicacao',
        formatarData(button.dataset.dataAplicacao)
      );

      preencherTexto(
        'detalhes_vacinacao_proxima_dose',
        formatarData(button.dataset.proximaDose)
      );

      preencherTexto(
        'detalhes_vacinacao_responsavel',
        button.dataset.responsavel
      );

      preencherTexto(
        'detalhes_vacinacao_lote',
        button.dataset.lote
      );

      preencherTexto(
        'detalhes_vacinacao_quantidade',
        button.dataset.quantidade
      );

      preencherTexto(
        'detalhes_vacinacao_via',
        button.dataset.via
      );

      preencherTexto(
        'detalhes_vacinacao_status',
        button.dataset.status
          ? button.dataset.status.charAt(0).toUpperCase() + button.dataset.status.slice(1)
          : '-'
      );

      preencherTexto(
        'detalhes_vacinacao_observacoes',
        button.dataset.observacoes
      );

      abrirModal(modalDetalhesVacinacao);
    });
  });

  document.querySelectorAll('[data-close-modal="modalDetalhesVacinacao"]').forEach((elemento) => {
    elemento.addEventListener('click', () => {
      fecharModal(modalDetalhesVacinacao);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      fecharModal(modalDetalhesVacinacao);
    }
  });
});