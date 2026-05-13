<div class="modal" id="modalCancelarVacinacao">

  <div class="modal-overlay" data-close-modal="modalCancelarVacinacao"></div>

  <div class="modal-container modal-cancelar-vacinacao-container">

    <div class="modal-header">

      <div>
        <h2>Cancelar Vacinação</h2>
        <p>Confirme o cancelamento do registro selecionado</p>
      </div>

      <button
        type="button"
        class="close-modal"
        data-close-modal="modalCancelarVacinacao"
      >
        ✕
      </button>

    </div>

    <form
      method="POST"
      action="<?= BASE_URL ?>/vacinas/cancelar"
      id="formCancelarVacinacao"
    >

      <input
        type="hidden"
        id="cancelar_vacinacao_id"
        name="id"
      >

      <div
        class="vacinacao-modal-message"
        id="cancelarVacinacaoModalMessage"
        hidden
      ></div>

      <div class="modal-body vacinacao-modal-body">

        <div class="vacinacao-cancel-warning">

          <i class="ri-error-warning-line"></i>

          <div>
            <strong>Atenção</strong>

            <p>
              Esta vacinação não será apagada do sistema.
              O registro continuará no histórico com status
              <strong>Cancelada</strong>.
            </p>
          </div>

        </div>

        <div class="vacinacao-cancel-info">

          <span>Animal</span>
          <strong id="cancelar_vacinacao_animal">-</strong>

          <span>Vacina</span>
          <strong id="cancelar_vacinacao_vacina">-</strong>

        </div>

      </div>

      <div class="modal-footer">

        <button
          type="button"
          class="btn-cancelar"
          data-close-modal="modalCancelarVacinacao"
        >
          Voltar
        </button>

        <button
          type="submit"
          class="btn-salvar btn-danger"
        >
          Confirmar Cancelamento
        </button>

      </div>

    </form>

  </div>

</div>