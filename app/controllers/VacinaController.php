<?php

class VacinaController extends Controller
{
    public function listar()
    {
        $vacinacaoModel = $this->model('Vacinacao');
        $animalModel = $this->model('Animal');

        $this->render('vacinas/vacinas', [
            'titulo' => 'GranBoi - Vacinação',
            'pageCss' => [
                '/public/assets/css/components/modal.css',
                '/public/assets/css/components/vacinacao/vacinacaoModal.css',
                '/public/assets/css/pages/vacinas/vacinas.css'
            ],
            'pageJs' => [
                '/public/assets/js/validations/vacinacao/vacinacaoValidation.js',
                '/public/assets/js/modals/vacinacao/cadastrarVacinacaoModal.js',
                '/public/assets/js/modals/vacinacao/detalhesVacinacaoModal.js',
                '/public/assets/js/modals/vacinacao/cancelarVacinacaoModal.js',
                '/public/assets/js/modals/vacinacao/reativarVacinacaoModal.js',
                '/public/assets/js/pages/vacinas/vacinasPage.js'
            ],
            'vacinacoes' => $vacinacaoModel->listarTodas(),
            'animais' => $animalModel->listarTodos()
        ]);
    }

    public function cadastrar()
    {
        $this->redirect('/vacinas');
    }

    public function salvar()
    {
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Requisição inválida.'
                ], 405);
            }

            $this->redirect('/vacinas');
        }

        $dados = [
            'animal_id' => $_POST['animal_id'] ?? '',
            'vacina' => trim($_POST['vacina'] ?? ''),
            'data_aplicacao' => $_POST['data_aplicacao'] ?? '',
            'proxima_dose' => $_POST['proxima_dose'] ?? null,
            'responsavel' => trim($_POST['responsavel'] ?? ''),
            'lote_vacina' => trim($_POST['lote_vacina'] ?? ''),
            'quantidade' => trim($_POST['quantidade'] ?? ''),
            'via_aplicacao' => $_POST['via_aplicacao'] ?? '',
            'observacoes' => trim($_POST['observacoes'] ?? '')
        ];

        $erro = null;

        if (
            empty($dados['animal_id']) ||
            empty($dados['vacina']) ||
            empty($dados['data_aplicacao']) ||
            empty($dados['responsavel']) ||
            empty($dados['lote_vacina']) ||
            empty($dados['quantidade']) ||
            empty($dados['via_aplicacao'])
        ) {
            $erro = 'Preencha os campos obrigatórios: animal, vacina, data de aplicação, responsável, lote, quantidade e via de aplicação.';
        }

        if (!$erro && !empty($dados['data_aplicacao']) && $dados['data_aplicacao'] > date('Y-m-d')) {
            $erro = 'A data de aplicação não pode ser futura.';
        }

        if (
            !$erro &&
            !empty($dados['proxima_dose']) &&
            $dados['proxima_dose'] < $dados['data_aplicacao']
        ) {
            $erro = 'A próxima dose não pode ser anterior à data de aplicação.';
        }

        if (
            !$erro &&
            !empty($dados['via_aplicacao']) &&
            !in_array($dados['via_aplicacao'], ['subcutanea', 'intramuscular', 'oral'])
        ) {
            $erro = 'Selecione uma via de aplicação válida.';
        }

        $animalModel = $this->model('Animal');

        if (!$erro) {
            $animal = $animalModel->buscarPorId($dados['animal_id']);

            if (!$animal) {
                $erro = 'Animal não encontrado.';
            } elseif ($animal['status'] !== 'ativo') {
                $erro = 'Não é possível registrar vacinação para animal vendido ou morto.';
            }
        }

        if ($erro) {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => $erro
                ], 422);
            }

            $_SESSION['erro'] = $erro;
            $this->redirect('/vacinas');
        }

        try {
            $vacinacaoModel = $this->model('Vacinacao');

            $vacinacaoModel->salvar($dados);

            if ($isAjax) {
                $this->json([
                    'sucesso' => true,
                    'mensagem' => 'Vacinação registrada com sucesso.'
                ]);
            }

            $_SESSION['sucesso'] = 'Vacinação registrada com sucesso.';
            $this->redirect('/vacinas');

        } catch (PDOException $e) {
            $mensagem = 'Erro ao registrar vacinação. Verifique os dados e tente novamente.';

            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => $mensagem
                ], 500);
            }

            $_SESSION['erro'] = $mensagem;
            $this->redirect('/vacinas');
        }
    }

    public function cancelar()
    {
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Requisição inválida.'
                ], 405);
            }

            $this->redirect('/vacinas');
        }

        $id = $_POST['id'] ?? null;

        if (empty($id)) {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Vacinação não informada.'
                ], 422);
            }

            $_SESSION['erro'] = 'Vacinação não informada.';
            $this->redirect('/vacinas');
        }

        $vacinacaoModel = $this->model('Vacinacao');

        $vacinacao = $vacinacaoModel->buscarPorId($id);

        if (!$vacinacao) {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Vacinação não encontrada.'
                ], 404);
            }

            $_SESSION['erro'] = 'Vacinação não encontrada.';
            $this->redirect('/vacinas');
        }

        if ($vacinacao['status'] === 'cancelada') {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Esta vacinação já está cancelada.'
                ], 422);
            }

            $_SESSION['erro'] = 'Esta vacinação já está cancelada.';
            $this->redirect('/vacinas');
        }

        try {
            $vacinacaoModel->cancelar($id);

            if ($isAjax) {
                $this->json([
                    'sucesso' => true,
                    'mensagem' => 'Vacinação cancelada com sucesso.'
                ]);
            }

            $_SESSION['sucesso'] = 'Vacinação cancelada com sucesso.';
            $this->redirect('/vacinas');

        } catch (PDOException $e) {
            $mensagem = 'Erro ao cancelar vacinação. Tente novamente.';

            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => $mensagem
                ], 500);
            }

            $_SESSION['erro'] = $mensagem;
            $this->redirect('/vacinas');
        }
    }

    public function reativar()
    {
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Requisição inválida.'
                ], 405);
            }

            $this->redirect('/vacinas');
        }

        $id = $_POST['id'] ?? null;

        if (empty($id)) {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Vacinação não informada.'
                ], 422);
            }

            $_SESSION['erro'] = 'Vacinação não informada.';
            $this->redirect('/vacinas');
        }

        $vacinacaoModel = $this->model('Vacinacao');

        $vacinacao = $vacinacaoModel->buscarPorId($id);

        if (!$vacinacao) {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Vacinação não encontrada.'
                ], 404);
            }

            $_SESSION['erro'] = 'Vacinação não encontrada.';
            $this->redirect('/vacinas');
        }

        if ($vacinacao['status'] !== 'cancelada') {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Apenas vacinações canceladas podem ser reativadas.'
                ], 422);
            }

            $_SESSION['erro'] = 'Apenas vacinações canceladas podem ser reativadas.';
            $this->redirect('/vacinas');
        }

        if ($vacinacao['status_animal'] !== 'ativo') {
            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => 'Não é possível reativar vacinação de animal vendido ou morto.'
                ], 422);
            }

            $_SESSION['erro'] = 'Não é possível reativar vacinação de animal vendido ou morto.';
            $this->redirect('/vacinas');
        }

        try {
            $vacinacaoModel->reativar($id);

            if ($isAjax) {
                $this->json([
                    'sucesso' => true,
                    'mensagem' => 'Vacinação reativada com sucesso.'
                ]);
            }

            $_SESSION['sucesso'] = 'Vacinação reativada com sucesso.';
            $this->redirect('/vacinas');

        } catch (PDOException $e) {
            $mensagem = 'Erro ao reativar vacinação. Tente novamente.';

            if ($isAjax) {
                $this->json([
                    'sucesso' => false,
                    'mensagem' => $mensagem
                ], 500);
            }

            $_SESSION['erro'] = $mensagem;
            $this->redirect('/vacinas');
        }
    }
}