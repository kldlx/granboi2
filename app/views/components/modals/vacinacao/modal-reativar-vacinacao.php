<div class="modal" id="modalReativarVacinacao">

  <div class="modal-overlay" data-close-modal="modalReativarVacinacao"></div>

  <div class="modal-container modal-reativar-vacinacao-container">

    <div class="modal-header">

      <div>
        <h2>Reativar Vacinação</h2>
        <p>Confirme a reativação do registro selecionado</p>
      </div>

      <button
        type="button"
        class="close-modal"
        data-close-modal="modalReativarVacinacao"
      >
        ✕
      </button>

    </div>

    <form
      method="POST"
      action="<?= BASE_URL ?>/vacinas/reativar"
      id="formReativarVacinacao"
    >

      <input
        type="hidden"
        id="reativar_vacinacao_id"
        name="id"
      >

      <div
        class="vacinacao-modal-message"
        id="reativarVacinacaoModalMessage"
        hidden
      ></div>

      <div class="modal-body vacinacao-modal-body">

        <div class="vacinacao-restore-warning">

          <i class="ri-refresh-line"></i>

          <div>
            <strong>Reativar registro</strong>

            <p>
              Esta vacinação voltará para o status
              <strong>Aplicada</strong>.
              Use esta ação apenas se o cancelamento foi feito por engano.
            </p>
          </div>

        </div>

        <div class="vacinacao-cancel-info">

          <span>Animal</span>
          <strong id="reativar_vacinacao_animal">-</strong>

          <span>Vacina</span>
          <strong id="reativar_vacinacao_vacina">-</strong>

        </div>

      </div>

      <div class="modal-footer">

        <button
          type="button"
          class="btn-cancelar"
          data-close-modal="modalReativarVacinacao"
        >
          Voltar
        </button>

        <button
          type="submit"
          class="btn-salvar btn-restore"
        >
          Confirmar Reativação
        </button>

      </div>

    </form>

  </div>

</div>