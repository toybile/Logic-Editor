# Propositional Logic Editor

[Open the editor / Abrir o editor](https://toybile.github.io/Propositional-Logic-Editor/)

A browser workspace for writing, organizing and evaluating propositional arguments. Read the **English** guide below.

Um espaço no navegador para escrever, organizar e avaliar argumentos proposicionais. Abra o guia **Português (Brasil)** abaixo.

<details>
<summary><strong>English — complete user guide</strong></summary>

## Start here

Open the website or download this repository and open `index.html` in a modern browser. No installation, account or server is required. The editor runs in the browser; arguments are stored locally.

1. Type `A`, press **Space**, insert `→`, press **Space**, then type `B` in a premise row.
2. Use the **+ below the rows** to add a premise containing `A`.
3. Add another row and click its **Premise** label to make it a **Conclusion**. Type `B`.
4. The **Argument** panel shows the formatted result. Enable **Validate logic (beta)** to check whether the conclusion follows from the premises.
5. Use the **file icon in the header** to save a project that can be imported later. Use **Export** in the Argument panel for `.txt` or `.pdf` output.

## Writing in blocks

- Each row contains editable blocks for proposition names and connectives. Blocks adapt to their contents; proposition names may have multiple letters, such as `Rain` or `WetStreet`.
- **Space** advances from a nonempty block to the next block. It does not insert a space inside a proposition name.
- **Backspace in an empty block** removes that block and returns to the previous one.
- **Enter** inserts a new premise immediately after the current row, ready to edit.
- **Tab** goes to the next row, at the end of its last block. **Shift+Tab** goes to the previous row the same way. At the first or last row, normal browser focus navigation applies when there is no adjacent row.
- The **Caps Lock icon (upward arrow above a horizontal line)** toggles uppercase conversion for subsequent typing; it does not rewrite all existing text. When active, its contrasting background, heavier icon and indicator dot show that uppercase typing is enabled; the tooltip also reports the active state.
- Click a block before choosing a sidebar symbol. The symbol is inserted into the active block, or into a new block after an occupied block.

## Premises, conclusions and blank rows

Click **Premise / Conclusion** to switch a row's role. Conclusions appear with `∴` in the formatted Argument. Multiple conclusion rows are supported and checked separately.

An empty row creates a blank line in the formatted Argument and is ignored by validation. Hold a row's **Premise / Conclusion** label for **0.3 seconds** to turn it into a blank row while preserving its text. That text stays editable but is omitted from the Argument and validation. A short click restores the row as a premise.

### Reorder, select and delete

- **Drag a row from its text or another available area of the row.** No dedicated drag handle or waiting period is needed: press and move. A normal click still lets you edit text. Role buttons, trash buttons and selection controls keep their own actions.
- Hold a row still for **0.2 seconds** to enable selection mode and select it. Hold a row again to exit selection mode and clear the selection. Moving before that starts immediate dragging instead. You can also use the **selection checkbox next to the lower +** to enable selection mode. Select several rows to drag them together in their original order or use **Delete selected**.
- Use a row's **trash icon** to delete it. If that row is selected, deletion applies to the selected group. Deleting nonempty content requires confirmation; empty rows can be removed directly. The editor keeps at least one editable row.
- The **undo and redo arrows below the rows** restore recorded row operations, including addition, deletion and reordering. These buttons are not a replacement for text-field undo.

## Multiple arguments and examples

The **+ in the header** opens two choices: **Blank** creates an empty argument immediately; **Example** opens a selection window with formula previews. An example is added as a new argument, preserving the existing ones. **Help** in this window opens an offline explanation page for the current examples; the upper-left arrow returns to the examples without changing your argument.

Examples include modus ponens, modus tollens, disjunctive syllogism, affirming the consequent and formulas with longer proposition names. The affirming-the-consequent example deliberately demonstrates an invalid inference.

The active argument tab has a subtle tinted background and border. Premises default to soft blue and conclusions to soft green. Hold a panel’s eye button for **0.2 seconds** to open its individual appearance dialog. It offers preset swatches and a full color picker; changes also update the panel side markers, persist in this browser, and reset with Restore defaults. Inset trash buttons slide out from behind the role button on row hover or keyboard focus. They turn red on hover and remain visible on touch devices. Blank rows have a separate upright square trash button. Each panel has its own Colored border toggle, using its own color. This choice persists in this browser. Appearance settings also toggle the outer marker and select the inner detail: soft gradient, none, inset channel, curved connections, soft wave, inner corners, subtle row numbering, color on hover, segmented line, vertical capsule, row arcs or localized light. Row details follow additions and reordering. The trash button also supports row dragging and the 0.2-second selection hold; a short click deletes. Click a tab to switch arguments. The **pencil** renames it; leave the name empty to restore automatic naming. The **X** deletes it, with confirmation for nonempty content. These controls appear on hover or keyboard focus and remain visible on touch layouts. **Hold a tab for about 0.25 seconds and drag** to reorder arguments. Automatic names follow tab positions.

Each argument retains its rows, numbering choice and proposition descriptions. Panel arrangement and interface settings belong to the workspace.

## Symbol library and search

Expand a symbol category to browse it. Click a symbol to insert it. The library includes propositional connectives, quantifiers, modal notation, sets, comparisons and delimiters.

**The library is broader than the validator:** being available for writing does not mean a symbol can be evaluated by the current classical propositional validator.

Symbol buttons have a uniform height and no individual dropdown arrows. **Hover** a symbol to see its meaning and available alternative notations. **Arrow Down** on a focused symbol opens the same window; **Escape** closes it. On touch screens, hold the symbol for **0.3 seconds** to open it without inserting. Choose a notation to insert it. The **? in the window's upper-right corner** opens an explanation dialog with a definition, example, notations, references and validator support. Close it with X or Escape to return to the symbol window; the editor stays in place.

Click the **magnifying glass** to reveal and focus symbol search in place of the library heading. Search matches symbol text, names and category labels, ignoring letter case and accents. Matching groups open automatically; clearing the query restores their earlier open/closed state. Leaving an empty search closes the field; leaving a nonempty query preserves it. Escape closes search; toggling the magnifying glass off also clears its filter.

## Movable, resizable panels

- **Move a panel:** press and hold for about **0.05 seconds** on an empty, noninteractive area, then drag. The movement cursor identifies available areas. Text, rows, buttons and logic results have their own interactions.
- **Resize horizontally:** drag the left or right edge. There is no vertical resize control; height follows the content.
- Panels snap near the horizontal center. Their horizontal position and width adapt proportionally when the sidebar opens/closes or the available viewport width changes. Width is constrained to the available workspace, including when interface scaling changes.
- If separated panels would collide because the upper one grows, the lower one moves down while preserving the chosen gap. When the upper one shrinks, the lower one moves back up. If you deliberately overlap them, this automatic separation does not change that arrangement.
- To move with the keyboard, focus the panel itself, rather than an input: **arrow keys** move it by 10 pixels; **Alt+arrow** moves by 1 pixel. **Shift+Left/Right** changes width.
- **Ctrl+Z** undoes recorded panel moves/resizes and row reordering. **Ctrl+Shift+Z** redoes them. On systems using Command, the corresponding modifier is supported. Inside an input, the browser's native text undo takes priority. Undo history is temporary and is not included in saved project files.

## Argument preview, copy and export

The Argument updates as you write. The **numbered-list icon** (Number lines) toggles line numbering for the current argument. The **eye icons** independently collapse the editing area and the Argument contents; collapsing the sidebar does not toggle either eye.

**Copy** places the formatted argument on the clipboard, subject to the browser's clipboard permissions. **Export** opens a menu immediately below the button:

| Format | Purpose | What it preserves |
| --- | --- | --- |
| `.txt` | Plain-text output | Formatted argument, symbols and the current numbering choice |
| `.pdf` | A document to view or print | Formatted argument rendered on A4 pages; long content wraps and continues onto more pages |
| `.lp.json` via the file menu | An editable backup | Row roles, text, argument names, numbering and proposition descriptions |

PDF pages contain rendered images, so their text is not selectable. Text and PDF exports do not include the validation report or proposition descriptions and cannot be imported as editable projects.

## Proposition descriptions — beta

Open the **description icon in the editing panel's header**. It lists proposition names found in the argument and previously saved descriptions. Write a meaning such as `A: It is raining`, then save. Hover an exact matching proposition block to see its description. Cancel closes the form without applying changes.

**Descriptions annotate proposition symbols, not entire premise rows.** The description of `A` is shared wherever `A` occurs in that argument. Descriptions are saved per argument and included in `.lp.json` backups.

**Descriptions do not enter logical validation.** The validator treats `A` and `B` as independent propositional variables; it does not interpret the natural-language descriptions, check their factual truth, or infer a relationship between them. Semantic analysis of descriptions is a possible future direction, not an implemented feature.

## Validate logic — beta

**Validate logic** opens or closes the validation area below the Argument. While enabled, it updates after edits. It checks **classical propositional consequence**: there must be no interpretation in which every premise is true and a conclusion is false.

- A conclusion is **valid** when it follows from the premises in every interpretation. This does not establish that the premises are factually true.
- An invalid conclusion includes a **counterexample** assigning true/false values to proposition names. Expand **Why is this a counterexample?** to see the premises and conclusion under that assignment; expand **Connective evaluation** for the calculation steps.
- With inconsistent premises, no interpretation makes every premise true. Classical consequence then holds vacuously, and the editor reports this condition.
- Without premises, a conclusion must be true in every interpretation: a tautology.
- Empty and blank-role rows are ignored. At least one nonempty conclusion is required. Syntax errors report the row and column; they are not an invalidity judgment.

### Accepted formulas

Names begin with a letter or `_`, may include letters, numbers, underscores and primes, and are **case-sensitive**: `A` and `a` are different propositions. Use explicit connectives between names. `⊤` and `⊥` are truth constants. Group with matching `()`, `[]` or `{}`.

| Connective | Accepted notations |
| --- | --- |
| Negation | `¬`, `∼`, `~`, `!` |
| Conjunction | `∧`, `&`, `•` |
| Inclusive disjunction | `∨`, `+` |
| Conditional | `→`, `⇒`, `⊃`, `->` |
| Reverse conditional | `←`, `⇐`, `<-` |
| Biconditional | `↔`, `⇔`, `≡`, `<->` |
| Exclusive disjunction / negated biconditional | `⊕`, `⊻`, `↮`, `⇎` |
| NAND | `↑`, `⊼`, `\|` |
| NOR | `↓`, `⊽` |
| Negated conditional | `↛`, `⇏` |

Precedence, strongest first: negation; conjunction/NAND; disjunction/XOR/NOR; conditionals; biconditional. Conditionals associate to the right; the other binary operators associate to the left. Parentheses make the intended grouping explicit.

Quantifiers, modal operators, set relations and other unsupported symbols are available as notation but are not evaluated. This is not a natural-language reasoner or a proof generator. Current validation limits: **16 distinct propositions**, **200 nonempty formulas**, **1,024 tokens**, **10,000 characters** and a parser nesting limit of **128** per formula.

### Truth table and pagination

Expand **Truth table** to see proposition assignments and each premise/conclusion's value. Red rows are counterexamples. Filters show **All interpretations**, **Counterexamples only** or **True premises**.

For `n` distinct propositions there are `2^n` interpretations. **“Pages show 128 interpretations”** means at most 128 table rows are displayed per page, not that only 128 are checked. The arrows switch pages. **`1–4 / 4`** means rows 1 through 4 of 4 filtered interpretations; both arrows are disabled when everything fits on one page. English uses `T/F`; Portuguese uses `V/F`.

### Redundant premises

Expand **Analyze redundant premises** and click **Analyze**. A premise is reported when it follows from the other premises. Each result considers removing **only that one premise**, not all reported premises together. The tool never deletes them automatically. For example, two copies of `A` may each be redundant separately, but removing both changes the argument.

### Compare formulas

Inside the validation area, **Compare formulas** opens two formula fields. It checks whether their biconditional is true in every interpretation. Equivalent formulas are confirmed; otherwise a differing interpretation is shown. It uses the same propositional syntax and limits as validation.

## Saving, importing and local storage

The **file icon in the header** opens its menu to the right:

- **Save all arguments** downloads `argumentos.lp.json`.
- **Save current argument** downloads `argumento.lp.json` with only the selected argument.
- **Import** accepts the editor's version-1 `.lp.json` format. A preview shows names and the first few rows; select the arguments to add or cancel. Import appends selected arguments and preserves existing ones. Invalid files are rejected without replacing the workspace.

Project files contain argument data, not panel positions or interface preferences. Import limits include 5 MiB per file, 100 arguments, 1,000 rows per argument and 1,000,000 total row-text characters; individual text, names and descriptions also have limits.

Arguments, descriptions, preferences and panel arrangement are automatically stored with `localStorage`. The status distinguishes **Saved in this browser**, **Saving…** and **Could not save in this browser**. Automatic browser storage is separate from downloading a backup.

There is no account or cloud synchronization. Another browser, device or origin (protocol, domain and port) has separate data; different URL paths on the same origin share browser storage. Private browsing, blocked storage or clearing site data can affect persistence. Use `.lp.json` for a portable editable backup.

## Settings and accessibility

Open the **settings icon** to switch **International English / Português (Brasil)** and **light / dark theme**. Sidebar size and argument size are independent, from **80% to 150%** in 5% steps, using sliders or minus/plus buttons.

The **default icon between theme and language** opens a confirmation listing the reset: English, light theme, both sizes at 100%, and panels centered at the full available width. Cancel preserves your settings. Reset does not delete arguments or descriptions.

The layout adapts to narrow screens, uses keyboard focus indicators and labeled icon controls, and reduces supported animations when the system requests reduced motion. Panels and tabs animate movement/appearance without changing their logical content.

## Opening the latest version

When opened online, the editor checks its published scripts and styles with a request that bypasses the browser cache. If they changed, it reloads once automatically before interaction; after interaction begins, an update notice lets you choose when to reload. Failed checks leave the current editor available. Local/offline use skips this check. Publishing and server-cache propagation can still take time; this check does not make an unfinished deployment available.

## Repository and implementation

`index.html` contains the application HTML, CSS and JavaScript. There is no build step or runtime dependency to install. Serve it as the root page on a static host or open it locally. This repository contains the editor; the separate portfolio menu links to it.

Where a browser exposes `document.modelContext.registerTool`, the editor can register a read-only `get_argument` tool returning the current rows, numbering and formatted text. Ordinary browser use does not require this optional integration.



Role buttons default to **names**. Double-click cycles through names, names + symbols, and symbols; premise and conclusion buttons have equal sizes within each mode. A single click switches the role immediately. **∵ means “because” and is used only as an interface marker for premises; it is not a universal formal premise symbol and is not included in formulas or logical validation. ∴ means “therefore”.** Individual appearance defaults to the outer marker on, colored border off, and inner detail None. The detail list opens above the interface and does not pass scrolling to the page. Drag inner details horizontally; a weak 3 px snap aligns them with the eye column. Double-click the detail or press Home while focused to restore alignment. Click outside the appearance dialog to close it. General Settings contains an Appearance help hint explaining the eye-button hold.

## Credits and authorship

Conceived and directed by **toybile**, developed with **OpenAI Codex**. Interface decisions, feature requirements and project direction were defined by toybile; Codex assisted with code implementation and documentation.

The symbol explanations link to their educational references. Those referenced works retain their respective authorship and licenses.

## License

This project is distributed under the **MIT License**. See [LICENSE](LICENSE) for the full terms. Preserve the copyright and license notice when redistributing the covered code. Third-party works retain their own terms.

</details>

<details>
<summary><strong>Português (Brasil) — guia completo de uso</strong></summary>

## Comece aqui

Abra o site ou baixe este repositório e abra `index.html` em um navegador moderno. Não é necessário instalar, criar conta ou usar servidor. O editor funciona no navegador e armazena os argumentos localmente.

1. Digite `A`, pressione **Espaço**, insira `→`, pressione **Espaço** e digite `B` em uma premissa.
2. Use o **+ abaixo das linhas** para adicionar uma premissa contendo `A`.
3. Adicione outra linha e clique em **Premissa** para transformá-la em **Conclusão**. Digite `B`.
4. O painel **Argumento** mostra o resultado formatado. Ative **Validar lógica (beta)** para verificar se a conclusão decorre das premissas.
5. Use o **ícone de arquivo no cabeçalho** para salvar um projeto que pode ser importado depois. Use **Exportar** no Argumento para gerar `.txt` ou `.pdf`.

## Escrita em blocos

- Cada linha contém blocos editáveis para nomes de proposições e conectivos. Os blocos acompanham o conteúdo; os nomes podem ter várias letras, como `Chove` ou `RuaMolhada`.
- **Espaço** avança de um bloco preenchido para o seguinte. Não insere um espaço dentro do nome de uma proposição.
- **Backspace em um bloco vazio** remove esse bloco e retorna ao anterior.
- **Enter** insere uma nova premissa imediatamente depois da linha atual, pronta para editar.
- **Tab** leva à próxima linha, com o cursor no fim do último bloco. **Shift+Tab** volta à linha anterior da mesma forma. Quando não há linha adjacente, vale a navegação normal de foco do navegador.
- O **ícone de Caps Lock (seta para cima sobre uma linha horizontal)** ativa ou desativa a conversão para maiúsculas durante a digitação seguinte; não reescreve todo o texto existente. Quando ativo, o fundo contrastante, o ícone mais marcado e o ponto indicador sinalizam a digitação em maiúsculas; a descrição do botão também informa o estado ativo.
- Clique em um bloco antes de escolher um símbolo no menu lateral. O símbolo entra no bloco ativo ou em um novo bloco depois de um bloco preenchido.

## Premissas, conclusões e linhas em branco

Clique em **Premissa / Conclusão** para alternar a função da linha. Conclusões aparecem com `∴` no Argumento formatado. É possível ter várias conclusões, verificadas separadamente.

Uma linha vazia gera uma linha em branco no Argumento e é ignorada na validação. Segure o botão **Premissa / Conclusão** por **0,3 segundo** para transformar uma linha em branco preservando o texto. Esse texto continua editável, mas fica fora do Argumento e da validação. Um clique curto restaura a linha como premissa.

### Reordenar, selecionar e excluir

- **Arraste uma linha pelo texto ou por outra área disponível dela.** Não é necessário usar uma alça nem esperar: pressione e mova. Um clique normal continua permitindo editar. Botões de função, lixeira e seleção mantêm suas próprias ações.
- Segure uma linha parada por **0,2 segundo** para ativar a seleção múltipla e selecioná-la. Segure uma linha novamente para sair do modo e limpar a seleção. Mover antes disso inicia o arrasto imediato. Também é possível usar a **caixa de seleção ao lado do + inferior** para ativar o modo de seleção. Selecione várias linhas para arrastá-las juntas, preservando sua ordem, ou use **Excluir selecionadas**.
- Use a **lixeira** para excluir uma linha. Se ela estiver selecionada, a exclusão vale para o grupo selecionado. Conteúdo preenchido exige confirmação; linhas vazias podem ser removidas diretamente. O editor mantém pelo menos uma linha editável.
- As **setas de desfazer e refazer abaixo das linhas** recuperam operações registradas nas linhas, incluindo adição, exclusão e reordenação. Não substituem o desfazer de texto dentro dos campos.

## Vários argumentos e exemplos

O **+ no cabeçalho** abre duas opções: **Em branco** cria um argumento vazio imediatamente; **Exemplo** abre uma janela com prévias das fórmulas. O exemplo entra como um novo argumento, preservando os existentes. **Ajuda** nessa janela abre uma página offline com explicações dos exemplos atuais; a seta superior esquerda retorna à lista sem alterar seu argumento.

Os exemplos incluem modus ponens, modus tollens, silogismo disjuntivo, afirmação do consequente e fórmulas com nomes maiores de proposições. A afirmação do consequente demonstra deliberadamente uma inferência inválida.

A aba do argumento ativo tem fundo e borda discretamente coloridos. Premissas usam azul suave e conclusões verde suave por padrão. Segure o olhinho de um painel por **0,2 segundo** para abrir sua janela individual de aparência. Ela oferece amostras e um seletor completo de cores; a escolha também altera as faixas laterais dos painéis, fica salva neste navegador e é restaurada pelo botão de padrão. Botões de lixeira deslizam de trás do botão de tipo ao passar o mouse ou focar a linha pelo teclado. Ficam vermelhos no hover e permanecem visíveis em dispositivos de toque. Linhas vazias têm uma lixeira em quadrado separado. Cada painel possui seu próprio interruptor Borda colorida, usando sua cor. A escolha fica salva neste navegador. A seção Aparência permite ocultar o traço externo e escolher o detalhe interno: degradê suave, nenhum, rebaixo, conexões curvas, ondulação suave, cantos internos, numeração discreta, cor no hover, linha segmentada, cápsula vertical, arcos por linha ou luz localizada. Os detalhes das linhas acompanham adições e reordenação. O botão de lixeira também permite arrastar a linha e segurar por 0,2 segundo para seleção; o clique curto exclui. Clique em uma aba para trocar de argumento. O **lápis** renomeia; deixe o nome vazio para recuperar a nomenclatura automática. O **X** exclui, com confirmação se houver conteúdo. Esses controles aparecem com o mouse sobre a aba ou com foco pelo teclado e ficam visíveis em telas com toque. **Segure uma aba por aproximadamente 0,25 segundo e arraste** para reordenar os argumentos. Os nomes automáticos acompanham as posições.

Cada argumento conserva suas linhas, escolha de numeração e descrições de proposições. A disposição dos painéis e as configurações de interface pertencem ao espaço de trabalho.

## Biblioteca de símbolos e busca

Expanda uma categoria para consultar os símbolos e clique em um símbolo para inseri-lo. A biblioteca inclui conectivos proposicionais, quantificadores, notação modal, conjuntos, comparações e delimitadores.

**A biblioteca é mais ampla que o validador:** um símbolo disponível para escrita não é necessariamente avaliável pela validação proposicional clássica atual.

Os botões têm altura uniforme e não possuem setinhas individuais. **Passe o mouse** sobre um símbolo para consultar seu significado e as notações alternativas disponíveis. **Seta para baixo** com foco no símbolo abre a mesma janela; **Escape** fecha. Em telas com toque, segure o símbolo por **0,3 segundo** para abrir sem inserir. Escolha uma notação para inseri-la. O **? no canto superior direito da janela** abre uma janela com definição, exemplo, notações, referências e indicação de suporte pelo validador. Feche pelo X ou Escape para voltar à janela do símbolo; o editor permanece no lugar.

Clique na **lupa** para abrir e focar a busca no lugar do título da biblioteca. Ela procura símbolos, nomes e categorias sem distinguir maiúsculas ou acentos. Grupos correspondentes abrem automaticamente; limpar a busca restaura o estado anterior dos grupos. Sair de uma busca vazia fecha o campo; uma consulta preenchida é preservada. Escape fecha a busca; desligar a lupa também limpa o filtro.

## Painéis movíveis e redimensionáveis

- **Mover um painel:** pressione e segure por aproximadamente **0,05 segundo** em uma área vazia, sem interação, e arraste. O cursor de movimento identifica áreas disponíveis. Textos, linhas, botões e resultados lógicos têm suas próprias interações.
- **Alterar a largura:** arraste a borda esquerda ou direita. Não há redimensionamento vertical; a altura acompanha o conteúdo.
- Os painéis se alinham ao se aproximarem do centro horizontal. Sua posição horizontal e largura se adaptam proporcionalmente quando o menu lateral abre/fecha ou a largura disponível muda. A largura fica limitada ao espaço de trabalho, inclusive após alterações de escala da interface.
- Se painéis separados forem colidir porque o superior cresceu, o inferior desce preservando o intervalo escolhido. Quando o superior diminui, o inferior volta a subir. Se você os sobrepuser deliberadamente, a separação automática não altera essa disposição.
- Pelo teclado, foque o próprio painel, não um campo: as **setas** movem 10 pixels; **Alt+seta** move 1 pixel. **Shift+Esquerda/Direita** altera a largura.
- **Ctrl+Z** desfaz movimentos/redimensionamentos registrados dos painéis e reordenações das linhas. **Ctrl+Shift+Z** refaz. O modificador Command correspondente também é aceito em sistemas que o utilizam. Dentro de um campo, o desfazer nativo de texto tem prioridade. O histórico é temporário e não acompanha os arquivos de projeto.

## Prévia do Argumento, cópia e exportação

O Argumento se atualiza durante a escrita. O **ícone de lista numerada** (Numerar linhas) alterna a numeração do argumento atual. Os **olhos** recolhem a área de edição e o conteúdo do Argumento de forma independente; recolher o menu lateral não altera esses controles.

**Copiar** envia o argumento formatado para a área de transferência, conforme as permissões do navegador. **Exportar** abre um menu logo abaixo do botão:

| Formato | Finalidade | O que preserva |
| --- | --- | --- |
| `.txt` | Saída em texto simples | Argumento formatado, símbolos e escolha atual de numeração |
| `.pdf` | Documento para visualizar ou imprimir | Argumento renderizado em páginas A4; conteúdo longo quebra linhas e continua em novas páginas |
| `.lp.json` pelo menu de arquivo | Cópia de segurança editável | Funções das linhas, texto, nomes dos argumentos, numeração e descrições de proposições |

As páginas do PDF contêm imagens renderizadas; o texto não é selecionável. Exportações em texto e PDF não incluem o relatório de validação nem as descrições de proposições e não podem ser importadas como projetos editáveis.

## Descrições de proposições — beta

Abra o **ícone de descrição no cabeçalho do painel de edição**. Ele lista nomes de proposições encontrados no argumento e descrições já salvas. Escreva um significado, como `A: Está chovendo`, e salve. Passe o mouse sobre um bloco com o nome exato para ver a descrição. Cancelar fecha sem aplicar mudanças.

**As descrições anotam símbolos de proposições, não linhas inteiras de premissas.** A descrição de `A` vale onde `A` aparecer naquele argumento. Elas são salvas por argumento e incluídas nas cópias `.lp.json`.

**As descrições não entram na validação lógica.** O validador trata `A` e `B` como variáveis proposicionais independentes; não interpreta suas descrições em linguagem natural, verifica sua verdade factual ou infere relações entre elas. Analisar o significado das descrições é uma possível direção futura, não uma função implementada.

## Validar lógica — beta

**Validar lógica** abre ou fecha a área de validação abaixo do Argumento. Enquanto está ativa, ela se atualiza após alterações. A verificação considera **consequência proposicional clássica**: não pode existir uma interpretação em que todas as premissas sejam verdadeiras e uma conclusão seja falsa.

- Uma conclusão é **válida** quando decorre das premissas em todas as interpretações. Isso não estabelece a verdade factual das premissas.
- Uma conclusão inválida apresenta um **contraexemplo** com valores verdadeiro/falso para as proposições. Expanda **Por que este é um contraexemplo?** para ver as premissas e a conclusão nessa atribuição; **Avaliação dos conectivos** mostra os passos do cálculo.
- Com premissas inconsistentes, nenhuma interpretação torna todas verdadeiras. A consequência clássica então vale por vacuidade, e o editor informa essa condição.
- Sem premissas, uma conclusão precisa ser verdadeira em todas as interpretações: uma tautologia.
- Linhas vazias e marcadas como em branco são ignoradas. É necessária pelo menos uma conclusão preenchida. Erros de sintaxe indicam linha e coluna; não são um julgamento de invalidade.

### Fórmulas aceitas

Nomes começam com letra ou `_` e podem conter letras, números, sublinhados e marcas primas. **Maiúsculas e minúsculas diferem:** `A` e `a` são proposições distintas. Use conectivos explícitos entre nomes. `⊤` e `⊥` são constantes de verdade. Agrupe usando pares correspondentes de `()`, `[]` ou `{}`.

| Conectivo | Notações aceitas |
| --- | --- |
| Negação | `¬`, `∼`, `~`, `!` |
| Conjunção | `∧`, `&`, `•` |
| Disjunção inclusiva | `∨`, `+` |
| Condicional | `→`, `⇒`, `⊃`, `->` |
| Condicional inverso | `←`, `⇐`, `<-` |
| Bicondicional | `↔`, `⇔`, `≡`, `<->` |
| Disjunção exclusiva / bicondicional negado | `⊕`, `⊻`, `↮`, `⇎` |
| NAND | `↑`, `⊼`, `\|` |
| NOR | `↓`, `⊽` |
| Condicional negado | `↛`, `⇏` |

Precedência, da maior para a menor: negação; conjunção/NAND; disjunção/XOR/NOR; condicionais; bicondicional. Condicionais associam à direita; os demais operadores binários, à esquerda. Parênteses explicitam o agrupamento pretendido.

Quantificadores, operadores modais, relações de conjuntos e outros símbolos não aceitos servem como notação, mas não são avaliados. Não há raciocínio em linguagem natural nem geração de demonstrações. Limites atuais: **16 proposições distintas**, **200 fórmulas preenchidas**, **1.024 tokens**, **10.000 caracteres** e limite de aninhamento de **128** no analisador por fórmula.

### Tabela-verdade e paginação

Expanda **Tabela-verdade** para ver as atribuições às proposições e o valor de cada premissa/conclusão. Linhas vermelhas são contraexemplos. Os filtros mostram **Todas as interpretações**, **Somente contraexemplos** ou **Premissas verdadeiras**.

Para `n` proposições distintas existem `2^n` interpretações. **“Exibição em páginas de 128 interpretações”** significa que aparecem no máximo 128 linhas por página, não que apenas 128 são verificadas. As setas trocam a página. **`1–4 / 4`** significa linhas 1 a 4 de um total de 4 interpretações após o filtro; as duas setas ficam desativadas quando tudo cabe em uma página. Inglês usa `T/F`; português usa `V/F`.

### Premissas redundantes

Expanda **Analisar premissas redundantes** e clique em **Analisar**. Uma premissa é indicada quando decorre das demais. Cada resultado considera retirar **somente aquela premissa**, não todas as indicadas juntas. A ferramenta nunca as exclui automaticamente. Duas cópias de `A`, por exemplo, podem ser redundantes separadamente, mas retirar ambas muda o argumento.

### Comparar fórmulas

Dentro da área de validação, **Comparar fórmulas** abre dois campos. A ferramenta verifica se o bicondicional entre elas é verdadeiro em todas as interpretações. Confirma equivalência ou mostra uma interpretação em que diferem. Usa a mesma sintaxe proposicional e os mesmos limites da validação.

## Salvamento, importação e armazenamento local

O **ícone de arquivo no cabeçalho** abre seu menu para a direita:

- **Salvar todos os argumentos** baixa `argumentos.lp.json`.
- **Salvar argumento atual** baixa `argumento.lp.json` apenas com o selecionado.
- **Importar** aceita o formato `.lp.json` versão 1 do editor. A prévia mostra nomes e as primeiras linhas; escolha o que adicionar ou cancele. A importação acrescenta os argumentos selecionados e preserva os existentes. Arquivos inválidos são rejeitados sem substituir o espaço de trabalho.

Arquivos de projeto contêm dados dos argumentos, não posições dos painéis ou preferências da interface. Os limites de importação incluem 5 MiB por arquivo, 100 argumentos, 1.000 linhas por argumento e 1.000.000 de caracteres de texto total; textos individuais, nomes e descrições também têm limites.

Argumentos, descrições, preferências e disposição dos painéis são salvos automaticamente com `localStorage`. O indicador distingue **Salvo neste navegador**, **Salvando…** e **Não foi possível salvar neste navegador**. O armazenamento automático é separado do download de uma cópia de segurança.

Não há conta nem sincronização na nuvem. Outro navegador, dispositivo ou origem (protocolo, domínio e porta) tem dados separados; caminhos de URL diferentes na mesma origem compartilham o armazenamento do navegador. Navegação privada, bloqueio do armazenamento ou limpeza dos dados do site podem afetar a persistência. Use `.lp.json` para uma cópia editável e portátil.

## Configurações e acessibilidade

Abra o **ícone de configurações** para alternar **International English / Português (Brasil)** e **tema claro / escuro**. Tamanho do menu lateral e dos argumentos são independentes: de **80% a 150%**, em passos de 5%, por controles deslizantes ou botões de menos/mais.

O **ícone de padrão entre tema e idioma** abre uma confirmação listando a restauração: inglês, tema claro, tamanhos em 100% e painéis centralizados com a largura disponível inteira. Cancelar preserva as configurações. Restaurar não apaga argumentos nem descrições.

A disposição se adapta a telas estreitas, tem indicadores de foco pelo teclado e controles com rótulos acessíveis, e reduz as animações contempladas quando o sistema solicita movimento reduzido. Os painéis e abas animam movimentos e aparições sem alterar o conteúdo lógico.

## Abrir a versão atual

Ao abrir online, o editor verifica os scripts e estilos publicados por uma requisição que evita o cache do navegador. Se mudaram, recarrega uma vez automaticamente antes da interação; depois que a interação começa, um aviso permite escolher quando atualizar. Falhas na consulta mantêm o editor atual disponível. O uso local/offline não faz essa consulta. A publicação e a propagação do cache do servidor ainda podem levar tempo; a consulta não disponibiliza uma publicação ainda incompleta.

## Repositório e implementação

`index.html` contém HTML, CSS e JavaScript da aplicação. Não há etapa de compilação nem dependência de execução para instalar. Sirva esse arquivo como página inicial em uma hospedagem estática ou abra localmente. Este repositório contém o editor; o menu de projetos separado aponta para ele.

Quando o navegador oferece `document.modelContext.registerTool`, o editor pode registrar a ferramenta de leitura `get_argument`, que retorna linhas atuais, numeração e texto formatado. O uso normal no navegador não exige essa integração opcional.



Os botões de tipo usam **nomes** por padrão. O duplo clique alterna entre nomes, nomes + símbolos e símbolos; premissa e conclusão têm dimensões iguais em cada modo. O clique simples troca o tipo imediatamente. **∵ significa “porque” e serve somente como identificação visual de premissas nesta interface; não é um símbolo formal universal de premissa e não integra as fórmulas nem a validação lógica. ∴ significa “portanto”.** A aparência individual tem como padrão o traço externo ligado, borda colorida desligada e detalhe interno Nenhum. A lista abre acima da interface e seu scroll não passa para a página. Arraste os detalhes internos horizontalmente; um encaixe fraco de 3 px alinha à coluna do olho. Duplo clique no detalhe ou Home com foco restaura o alinhamento. Clique fora da janela de aparência para fechar. Nas configurações gerais, a ajuda em Aparência explica como segurar o olhinho.

## Créditos e autoria

Concebido e dirigido por **toybile**, desenvolvido com o **OpenAI Codex**. As decisões de interface, os requisitos das funções e a direção do projeto foram definidos por toybile; o Codex auxiliou na implementação do código e na documentação.

As explicações dos símbolos apontam para suas referências educacionais. As obras referenciadas mantêm suas respectivas autorias e licenças.

## Licença

Este projeto é distribuído sob a **licença MIT**. Consulte [LICENSE](LICENSE) para os termos completos. Preserve os avisos de direitos autorais e de licença ao redistribuir o código abrangido. Obras de terceiros mantêm seus próprios termos.

</details>
