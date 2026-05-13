function validarCadastroVacinacao() {
  const animalId =
    document.getElementById('animal_id')?.value;

  const vacina =
    document.getElementById('vacina')?.value.trim();

  const dataAplicacao =
    document.getElementById('data_aplicacao')?.value;

  const proximaDose =
    document.getElementById('proxima_dose')?.value;

  const responsavel =
    document.getElementById('responsavel')?.value.trim();

  const loteVacina =
    document.getElementById('lote_vacina')?.value.trim();

  const quantidade =
    document.getElementById('quantidade')?.value.trim();

  const viaAplicacao =
    document.getElementById('via_aplicacao')?.value;

  if (
    !animalId ||
    !vacina ||
    !dataAplicacao ||
    !responsavel ||
    !loteVacina ||
    !quantidade ||
    !viaAplicacao
  ) {
    return 'Preencha os campos obrigatórios: animal, vacina, data de aplicação, responsável, lote, quantidade e via de aplicação.';
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataAplicacaoObj =
    new Date(dataAplicacao + 'T00:00:00');

  if (dataAplicacaoObj > hoje) {
    return 'A data de aplicação não pode ser futura.';
  }

  if (proximaDose) {
    const proximaDoseObj =
      new Date(proximaDose + 'T00:00:00');

    if (proximaDoseObj < dataAplicacaoObj) {
      return 'A próxima dose não pode ser anterior à data de aplicação.';
    }
  }

  if (
    !['subcutanea', 'intramuscular', 'oral'].includes(viaAplicacao)
  ) {
    return 'Selecione uma via de aplicação válida.';
  }

  return null;
}