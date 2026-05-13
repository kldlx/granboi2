<?php

$viasAplicacaoLabels = [
  'subcutanea' => 'Subcutânea',
  'intramuscular' => 'Intramuscular',
  'oral' => 'Oral'
];

?>

<main class="main-content">

  <header class="topbar">

    <button
      class="menu-toggle"
      id="menuToggle"
    >
      <i class="ri-menu-line"></i>
    </button>

    <div class="topbar-title">

      <h1>Controle de Vacinação</h1>

      <p>
        Registre e acompanhe as vacinações dos animais
      </p>

    </div>

    <div class="profile">

      <div class="profile-info">
        <h3><?= $_SESSION['usuario']['nome'] ?? 'Usuário' ?></h3>
        <span><?= $_SESSION['usuario']['papel_nome'] ?? 'Perfil' ?></span>
      </div>

      <div class="profile-avatar">
        <?= strtoupper(substr($_SESSION['usuario']['nome'] ?? 'U', 0, 1)) ?>
      </div>

    </div>

  </header>

  <?php if (!empty($_SESSION['sucesso'])): ?>

    <div class="vacinacao-message vacinacao-message-success">
      <i class="ri-checkbox-circle-line"></i>
      <span><?= $_SESSION['sucesso'] ?></span>
    </div>

    <?php unset($_SESSION['sucesso']); ?>

  <?php endif; ?>

  <?php if (!empty($_SESSION['erro'])): ?>

    <div class="vacinacao-message vacinacao-message-error">
      <i class="ri-error-warning-line"></i>
      <span><?= $_SESSION['erro'] ?></span>
    </div>

    <?php unset($_SESSION['erro']); ?>

  <?php endif; ?>

  <section class="vacinacao-page-actions">

    <div>
      <h2>Histórico de Vacinação</h2>
      <p>Vacinas registradas no sistema</p>
    </div>

    <button
      type="button"
      class="vacinacao-create-btn"
      id="abrirModalCadastrarVacinacao"
    >
      <i class="ri-add-line"></i>
      <span>Registrar Vacinação</span>
    </button>

  </section>

  <section class="vacinacao-table-container">

    <table class="vacinacao-table">

      <thead>

        <tr>
          <th>Animal</th>
          <th>Vacina</th>
          <th>Aplicação</th>
          <th>Próxima Dose</th>
          <th>Responsável</th>
          <th>Via</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>

      </thead>

      <tbody>

        <?php if (!empty($vacinacoes)): ?>

          <?php foreach ($vacinacoes as $vacinacao): ?>

            <?php
              $viaAplicacao = $vacinacao['via_aplicacao'] ?? '';
              $viaAplicacaoLabel = $viasAplicacaoLabels[$viaAplicacao] ?? (!empty($viaAplicacao) ? ucfirst($viaAplicacao) : '-');

              $animalLabel = '#' . $vacinacao['brinco_identificador'];

              if (!empty($vacinacao['raca'])) {
                $animalLabel .= ' - ' . $vacinacao['raca'];
              }
            ?>

            <tr>

              <td>
                <?= htmlspecialchars($animalLabel) ?>
              </td>

              <td>
                <?= htmlspecialchars($vacinacao['vacina']) ?>
              </td>

              <td>
                <?= date('d/m/Y', strtotime($vacinacao['data_aplicacao'])) ?>
              </td>

              <td>
                <?= !empty($vacinacao['proxima_dose']) ? date('d/m/Y', strtotime($vacinacao['proxima_dose'])) : '-' ?>
              </td>

              <td>
                <?= htmlspecialchars($vacinacao['responsavel'] ?? '-') ?>
              </td>

              <td>
                <?= htmlspecialchars($viaAplicacaoLabel) ?>
              </td>

              <td>
                <span class="vacinacao-status vacinacao-status-<?= htmlspecialchars($vacinacao['status']) ?>">
                  <?= ucfirst(htmlspecialchars($vacinacao['status'])) ?>
                </span>
              </td>

              <td>
                <div class="vacinacao-actions">

                  <button
                    type="button"
                    class="vacinacao-action-btn detalhes-vacinacao-btn"
                    title="Ver detalhes"
                    data-animal="<?= htmlspecialchars($animalLabel) ?>"
                    data-vacina="<?= htmlspecialchars($vacinacao['vacina']) ?>"
                    data-data-aplicacao="<?= htmlspecialchars($vacinacao['data_aplicacao']) ?>"
                    data-proxima-dose="<?= htmlspecialchars($vacinacao['proxima_dose'] ?? '') ?>"
                    data-responsavel="<?= htmlspecialchars($vacinacao['responsavel'] ?? '') ?>"
                    data-lote="<?= htmlspecialchars($vacinacao['lote_vacina'] ?? '') ?>"
                    data-quantidade="<?= htmlspecialchars($vacinacao['quantidade'] ?? '') ?>"
                    data-via="<?= htmlspecialchars($viaAplicacaoLabel) ?>"
                    data-status="<?= htmlspecialchars($vacinacao['status']) ?>"
                    data-observacoes="<?= htmlspecialchars($vacinacao['observacoes'] ?? '') ?>"
                  >
                    <i class="ri-eye-line"></i>
                  </button>

                  <?php if ($vacinacao['status'] !== 'cancelada'): ?>

                    <button
                      type="button"
                      class="vacinacao-action-btn vacinacao-action-danger cancelar-vacinacao-btn"
                      title="Cancelar vacinação"
                      data-id="<?= htmlspecialchars($vacinacao['id']) ?>"
                      data-animal="<?= htmlspecialchars($animalLabel) ?>"
                      data-vacina="<?= htmlspecialchars($vacinacao['vacina']) ?>"
                    >
                      <i class="ri-close-circle-line"></i>
                    </button>

                  <?php else: ?>

                    <button
                      type="button"
                      class="vacinacao-action-btn vacinacao-action-restore reativar-vacinacao-btn"
                      title="Reativar vacinação"
                      data-id="<?= htmlspecialchars($vacinacao['id']) ?>"
                      data-animal="<?= htmlspecialchars($animalLabel) ?>"
                      data-vacina="<?= htmlspecialchars($vacinacao['vacina']) ?>"
                    >
                      <i class="ri-refresh-line"></i>
                    </button>

                  <?php endif; ?>

                </div>
              </td>

            </tr>

          <?php endforeach; ?>

        <?php else: ?>

          <tr>
            <td colspan="8" class="vacinacao-empty">
              Nenhuma vacinação registrada.
            </td>
          </tr>

        <?php endif; ?>

      </tbody>

    </table>

  </section>

  <?php require_once ROOT_PATH . '/app/views/components/modals/vacinacao/modal-cadastrar-vacinacao.php'; ?>
  <?php require_once ROOT_PATH . '/app/views/components/modals/vacinacao/modal-detalhes-vacinacao.php'; ?>
  <?php require_once ROOT_PATH . '/app/views/components/modals/vacinacao/modal-cancelar-vacinacao.php'; ?>
  <?php require_once ROOT_PATH . '/app/views/components/modals/vacinacao/modal-reativar-vacinacao.php'; ?>

</main>