const Utilitarios = require("../src/utilitarios");

describe("Utilitarios", () => {
	let util;

	beforeEach(() => {
		util = new Utilitarios();
	});

	test("inverterString deve inverter uma string corretamente", () => {
		expect(util.inverterString("jest")).toBe("tsej");
	});

	test("contarCaracteres deve retornar o número de caracteres da string", () => {
		expect(util.contarCaracteres("teste")).toBe(5);
	});

	test("paraMaiusculas deve converter a string para maiúsculas", () => {
		expect(util.paraMaiusculas("abc")).toBe("ABC");
	});

	test("somar deve retornar a soma de dois números", () => {
		expect(util.somar(2, 3)).toBe(5);
	});

	test("dividir deve lançar erro ao dividir por zero", () => {
		expect(() => util.dividir(10, 0)).toThrow("Divisão por zero");
	});
});
