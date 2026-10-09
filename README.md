# Editor de Lógica Proposicional

Editor web para escrever, organizar e apresentar argumentos formais, com uma biblioteca de símbolos matemáticos e lógicos, múltiplos documentos e opções de personalização.

O projeto foi desenvolvido para facilitar a escrita de expressões formais, evitando a necessidade de procurar e copiar símbolos manualmente.

**[Abrir o Editor](https://toybile.github.io/Editor-de-Logica/)** · [Ver portfólio](https://toybile.github.io/)

*O endereço do editor estará disponível após a publicação deste repositório no GitHub Pages.*

## Funcionalidades

### Escrita de argumentos

- Criação de premissas e conclusões independentes.
- Inclusão, exclusão e reorganização de linhas.
- Alternância entre premissas, conclusões e linhas vazias.
- Reordenação das expressões por arrastar e soltar.
- Numeração opcional das linhas.
- Visualização formatada do argumento durante a edição.

### Biblioteca de símbolos

Biblioteca lateral com símbolos distribuídos em categorias, incluindo:

- Conectivos proposicionais: ¬, ∧, ∨, →, ↔.
- Quantificadores: ∀, ∃, ∃!.
- Operadores modais: □, ◇.
- Dedução e consequência: ⊢, ⊨.
- Teoria dos conjuntos: ∈, ⊆, ∪, ∩.
- Operadores matemáticos, relações e delimitadores.

A biblioteca também apresenta notações alternativas para determinados operadores, permitindo selecionar diferentes representações simbólicas.

### Gerenciamento de argumentos

- Criação de múltiplos argumentos em abas.
- Alternância entre documentos.
- Renomeação e exclusão de argumentos.
- Reorganização das abas.
- Armazenamento local dos argumentos para recuperação posterior.

### Personalização

- Temas claro e escuro.
- Interface em Português (Brasil) e Inglês.
- Modo de foco para ocultar a biblioteca lateral.
- Exibição ou ocultação das seções do editor.
- Ajuste independente do tamanho da biblioteca e da área de escrita.

### Exportação

Os argumentos podem ser:

- Copiados para a área de transferência.
- Exportados como arquivos de texto (`.txt`).
- Apresentados com ou sem numeração.

## Exemplo de utilização

Um argumento baseado na regra *Modus Ponens*:

**Premissas**

1. P → Q
2. P

**Conclusão**

3. ∴ Q

O editor permite escrever as expressões, organizar sua apresentação e exportar o resultado.

## Tecnologias

O projeto é uma aplicação web estática construída com:

- **HTML5:** estrutura da interface.
- **CSS3:** estilização, responsividade e temas.
- **JavaScript:** edição interativa e gerenciamento dos argumentos.
- **Web Storage API (`localStorage`):** persistência local de documentos e preferências.
- **GitHub Pages:** hospedagem da aplicação.

A implementação não depende de frameworks JavaScript nem exige um servidor de aplicação para seu funcionamento básico.

## Execução local

1. Clone o repositório:

   `git clone https://github.com/toybile/Editor-de-Logica.git`

2. Acesse a pasta do projeto.

3. Abra o arquivo `index.html` em um navegador moderno.

Não é necessário instalar dependências ou executar um processo de compilação.

## Armazenamento de dados

Os argumentos e as preferências de interface são armazenados localmente no navegador por meio de `localStorage`.

Isso permite recuperar os documentos ao retornar à aplicação no mesmo contexto de armazenamento.

**Limitações:**

- Não existe sincronização automática entre dispositivos.
- Os documentos não são armazenados em uma conta online.
- A exclusão dos dados locais do site pelo navegador pode resultar na perda dos argumentos armazenados.

Recomenda-se exportar os argumentos importantes para manter cópias independentes.

## Escopo

O editor é uma ferramenta de **escrita e organização de lógica formal**.

Embora permita trabalhar com diferentes símbolos e estruturas argumentativas, não constitui, em sua implementação atual, um sistema automático de demonstração de teoremas ou verificação da validade lógica dos argumentos.

A biblioteca inclui símbolos de áreas relacionadas à Lógica Proposicional, como Lógica de Predicados, Lógica Modal e Teoria dos Conjuntos.

## Desenvolvimento e publicação

A aplicação é mantida neste repositório, de maneira independente do portfólio principal.

As atualizações enviadas à branch configurada no GitHub Pages são publicadas no endereço do editor após a conclusão do deployment.

O portfólio pode incorporar a aplicação por meio de um `iframe` ou disponibilizar um link direto, sem precisar manter uma cópia independente de seu código.

---

**Desenvolvido por [toybile](https://github.com/toybile).**

Parte do conjunto de projetos apresentados em [toybile.github.io](https://toybile.github.io/).
