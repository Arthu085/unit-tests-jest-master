const ContaBancaria = require("../src/contaBancaria");

describe("Conta Bancária", () => {
	let conta;
	let dadosConta;

	beforeEach(() => {
		dadosConta = {
			id: 1,
			titular: "João Silva",
			saldo: 1000,
			limite: 500,
			status: "ativa",
		};
		conta = new ContaBancaria(dadosConta);
	});

	it("deve retornar o saldo corretamente", () => {
		expect(conta.obterSaldo()).toBe(1000);
	});

	it("deve retornar o titular corretamente", () => {
		expect(conta.obterTitular()).toBe("João Silva");
	});

	it("deve retornar o status corretamente", () => {
		expect(conta.obterStatus()).toBe("ativa");
	});

	it("deve retornar se está ativa", () => {
		expect(conta.estaAtiva()).toBe(true);
	});

	it("deve retornar o limite da conta corretamente", () => {
		expect(conta.obterLimite()).toBe(500);
	});

	describe("Operações de Depósito e Saque", () => {
		it("deve depositar um valor positivo corretamente", () => {
			const sucesso = conta.depositar(500);
			expect(sucesso).toBe(true);
			expect(conta.obterSaldo()).toBe(1500);
		});

		it("não deve permitir depósito de valor zero ou negativo", () => {
			const sucesso = conta.depositar(-100);
			expect(sucesso).toBe(false);
			expect(conta.obterSaldo()).toBe(1000);
		});

		it("deve permitir saque quando houver saldo + limite suficiente", () => {
			const sucesso = conta.sacar(1200);
			expect(sucesso).toBe(true);
			expect(conta.obterSaldo()).toBe(-200);
		});

		it("não deve permitir saque quando o valor for maior que o saldo + limite", () => {
			const sucesso = conta.sacar(2000);
			expect(sucesso).toBe(false);
			expect(conta.obterSaldo()).toBe(1000);
		});
	});

	describe("Outras Operações e Validações", () => {
		it("deve alterar o titular se receber um valor válido", () => {
			expect(conta.alterarTitular("Maria Souza")).toBe(true);
			expect(conta.obterTitular()).toBe("Maria Souza");
		});

		it("não deve alterar o titular contendo valores falsy (vazio, null, undefined)", () => {
			expect(conta.alterarTitular("")).toBe(false);
		});

		it("deve bloquear e ativar a conta", () => {
			expect(conta.bloquearConta()).toBe(true);
			expect(conta.obterStatus()).toBe("bloqueada");
			expect(conta.bloquearConta()).toBe(false);

			expect(conta.ativarConta()).toBe(true);
			expect(conta.obterStatus()).toBe("ativa");
			expect(conta.ativarConta()).toBe(false);
		});

		it("deve encerrar a conta apenas se o saldo for zero", () => {
			expect(conta.encerrarConta()).toBe(false);

			conta.sacar(1000);
			expect(conta.encerrarConta()).toBe(true);
			expect(conta.obterStatus()).toBe("encerrada");
		});

		it("deve verificar se pode sacar", () => {
			expect(conta.podeSacar(1000)).toBe(true);
			expect(conta.podeSacar(1500)).toBe(true);
			expect(conta.podeSacar(2000)).toBe(false);
			expect(conta.podeSacar(-10)).toBe(false);
		});

		it("deve aplicar tarifas corretamente", () => {
			expect(conta.aplicarTarifa(50)).toBe(true);
			expect(conta.obterSaldo()).toBe(950);
			expect(conta.aplicarTarifa(-10)).toBe(false);
		});

		it("deve ajustar o limite", () => {
			expect(conta.ajustarLimite(1000)).toBe(true);
			expect(conta.obterLimite()).toBe(1000);
			expect(conta.ajustarLimite(-100)).toBe(false);
		});

		it("deve indicar se o saldo está negativo", () => {
			expect(conta.saldoNegativo()).toBe(false);
			conta.sacar(1200);
			expect(conta.saldoNegativo()).toBe(true);
		});

		it("deve realizar transferência com sucesso", () => {
			const contaDestinoBase = {
				id: 2,
				titular: "Ana",
				saldo: 0,
				limite: 0,
				status: "ativa",
			};
			const contaDestino = new ContaBancaria(contaDestinoBase);

			expect(conta.transferir(400, contaDestino)).toBe(true);
			expect(conta.obterSaldo()).toBe(600);
			expect(contaDestino.obterSaldo()).toBe(400);

			expect(conta.transferir(-100, contaDestino)).toBe(false);

			expect(conta.transferir(2000, contaDestino)).toBe(false);
		});

		it("deve calcular o saldo disponível e gerar resumo", () => {
			expect(conta.calcularSaldoDisponivel()).toBe(1500);

			const resumo = conta.gerarResumo();
			expect(resumo.titular).toBe("João Silva");
			expect(resumo.saldo).toBe(1000);
			expect(resumo.limite).toBe(500);
			expect(resumo.disponivel).toBe(1500);
			expect(resumo.status).toBe("ativa");
		});

		it("deve resetar a conta", () => {
			conta.resetarConta();
			expect(conta.obterSaldo()).toBe(0);
			expect(conta.obterLimite()).toBe(0);
			expect(conta.obterStatus()).toBe("ativa");
			expect(conta.conta.atualizadaEm).toBeDefined();
		});
	});
});
