# Logic Editor

[Open the editor / Abrir o editor](https://toybile.github.io/Logic-Editor/)

A browser workspace for writing and organizing logical arguments, including modal symbols and quantifiers. Automatic validation supports classical propositional logic. Read the **English** guide below. This README is the functionality reference; writing notation and automatic validation have different scopes.

Um espaço no navegador para escrever e organizar argumentos lógicos, incluindo símbolos modais e quantificadores. A validação automática contempla lógica proposicional clássica. Abra o guia **Português (Brasil)** abaixo. Este README é a referência das funcionalidades; notação escrita e validação automática têm escopos diferentes.

<details>
<summary><strong>English — complete user guide</strong></summary>

## Start here

Open the website or download this repository and open `index.html` in a modern browser. No installation, account or server is required. The editor runs in the browser; arguments are stored locally.

1. Type `A`, press **Space**, insert `→`, press **Space**, then type `B` in a premise row.
2. Use the **+ below the rows** to add a premise containing `A`.
3. Add another row and click its **Premise** label to make it a **Conclusion**. Type `B`.
4. The **Argument** panel shows the formatted result. Enable **Validate logic (beta)** to check whether the conclusion follows from the premises.
5. Use the **file icon in the header** to save a project that can be imported later. Use **Export** in the Argument panel for `.txt`, `.pdf` or `.png` output.

## Writing in blocks

- Click any existing block to edit it in place, including blocks before the last one. Later blocks are preserved.
- Each row contains editable blocks for proposition names and connectives. Blocks adapt to their contents; proposition names may have multiple letters, such as `Rain` or `WetStreet`.
- **Space** advances from a nonempty block to the next block. It does not insert a space inside a proposition name.
- **Backspace or Delete in an empty block** removes that block immediately. Delete focuses the next block in the same position; Backspace focuses the previous block. At an edge, the remaining neighbor receives focus. At least one editable block is retained.
- **Space** advances to the next block and creates an empty block when there is no next one. **Shift + Space** inserts an empty block immediately after the current one without replacing later blocks. **Alt + Space is not captured by the editor**.
- **Left/Right arrow at the text boundary** focuses the neighboring block (left at the start; right at the end). Within text, arrows retain ordinary caret movement.
- **Enter** inserts a premise immediately after the current row, except while row selection is active.
- **Tab** goes to the next row, at the end of its last block. **Shift+Tab** goes to the previous row the same way. At the first or last row, normal browser focus navigation applies when there is no adjacent row.
- The **Caps Lock icon (upward arrow above a horizontal line)** toggles uppercase conversion for subsequent typing; it does not rewrite all existing text. When active, its contrasting background, heavier icon and indicator dot show that uppercase typing is enabled; the tooltip also reports the active state.
- Click a block before choosing a sidebar symbol. The symbol is inserted into the active block, or into a new block after an occupied block.

## Premises, conclusions and blank rows

Click **Premise / Conclusion** to switch a row's role. Conclusions appear with `∴` in the formatted Argument. Multiple conclusion rows are supported and checked separately.

An empty row creates a blank line in the formatted Argument and is ignored by validation. Hold a row's **Premise / Conclusion** label for **configured hold delay (default: 0.5 seconds)** to turn it into a blank row while preserving its text. That text stays editable but is omitted from the Argument and validation. A short click restores the row as a premise.

### Reorder, select and delete

- **Drag a row from its text or another available area of the row.** No dedicated drag handle or waiting period is needed: press and move. A normal click still lets you edit text. Role buttons, trash buttons and selection controls keep their own actions.
- Hold a row still for **the configured delay (default 0.5 seconds)** to enable selection mode and select it. Holding another row adds it to the selection; holding an already selected row keeps it selected. Click a row or its checkbox to toggle it. Deselecting the last row exits selection mode automatically. Moving before the hold completes starts immediate dragging instead. Select several rows to drag them together in their original order or use **Delete selected**.
- **Hold a row's trash button for configured hold delay (default: 0.5 seconds)** to request deletion of all premises and conclusions in the current argument. All affected rows are selected before a confirmation dialog with a red top border appears. Cancel preserves the rows and prior selection; confirmation clears this argument only, keeps one empty editable row, and can be undone. Move before the hold completes to drag instead.
- Use a row's **trash icon** to delete it. If that row is selected, deletion applies to the selected group. Deleting nonempty content requires confirmation; empty rows can be removed directly. The editor keeps at least one editable row.
- The **undo and redo arrows below the rows** restore recorded row operations, including addition, deletion and reordering. These buttons are not a replacement for text-field undo.


The **+ below the rows** and the full-width dividers between them insert a premise at the requested position. Their + is centered; line creation (including Enter) is disabled while selection mode is active. Reordering shows a lightly tinted placeholder without a dashed outline; a row changes position after sufficient overlap with its neighbor (65%), also used by category ordering.

## Multiple arguments and examples

The **+ in the header** opens two choices: **Blank** creates an empty argument immediately; **Example** opens a selection window with formula previews. An example is added as a new argument, preserving the existing ones. **Help** in this window opens an offline explanation page for the current examples; the upper-left arrow returns to the examples without changing your argument.

Examples include modus ponens, modus tollens, disjunctive syllogism, affirming the consequent and formulas with longer proposition names. The affirming-the-consequent example deliberately demonstrates an invalid inference.

Arguments use discreet underline tabs in the page header; the underline marks the current argument. Editor and preview panels remain independently movable. A hover/focus insertion line above the first premise adds a new premise at the beginning and supports undo; it is unavailable while row selection is active. The upper symbol insertion line appears only on hover/focus and overlays the margin, preserving equal upper/lower category spacing. The centered navigation has a left button that switches between underline tabs and a compact selector, with a smooth transition. Both modes remain centered and keep the current argument. The view preference persists in this browser; the compact mode uses a rounded popup and offers rename on the left and delete on the right inside each popup item on hover or keyboard focus (always visible on touch). The compact popup has a narrow central surface; edit/delete actions appear as separate rounded buttons outside its left/right edges beside the hovered or focused item. Soft separators, including one above the first argument and above the first symbol category, reveal a centered + on hover or keyboard focus; clicking inserts a blank argument at that exact position, preserving existing content and order. No edit/delete controls appear beside the closed selector. Tab actions float below the title on hover or keyboard focus, without reserving vertical or lateral space or increasing header height. Premises default to soft blue and conclusions to soft green. Hold a panel’s eye button for **the configured delay (default 0.5 seconds)** to open its individual appearance dialog. It offers preset swatches and a full color picker; changes also update the panel side markers, persist in this browser, and reset with Restore defaults. Inset trash buttons slide out from behind the role button on row hover or keyboard focus. They turn red on hover and remain visible on touch devices. Converting a row to blank preserves the trash position and click area, and the invisible role control keeps its full restore-to-premise click area. Only the visible trash box responds to deletion clicks; the surrounding gutter preserves hover without deleting. Selection checkboxes and highlights start at the panel title column, leaving inner decorations uncovered. Each panel has its own Colored border toggle, using its own color. This choice persists in this browser. Appearance settings also toggle the outer marker and select the inner detail: soft gradient, none, inset channel, curved connections, soft wave, inner corners, subtle row numbering, color on hover, segmented line, vertical capsule, row arcs or localized light. Row details follow additions and reordering. The trash button also supports row dragging; holding it still for configured hold delay (default: 0.5 seconds) requests deletion of all rows in the current argument. A short click deletes the row or current selection. Click a tab to switch arguments. The **pencil** renames it; leave the name empty to restore automatic naming. The **X** deletes it, with confirmation for nonempty content. These controls appear on hover or keyboard focus and remain visible on touch layouts. **Hold a tab for the configured hold delay (default: 0.5 seconds) and drag** to reorder arguments. Automatic names follow tab positions.

Each argument retains its rows, numbering choice and proposition descriptions. Panel arrangement and interface settings belong to the workspace.

## Symbol library and search

The library contains propositional connectives, implication/equivalence, quantifiers/equality, modal operators, deduction/consequence, set operations, set relations, operators over families, comparison/definition and delimiters. **Available notation is broader than the classical propositional validator.**

Each section has a move/collapse grip, category selector, duplicate button and close button. Repeated categories are allowed; closing a section does not delete arguments or favorites.

| Control or gesture | Result |
| --- | --- |
| Category selector | Click to open/close a centered grid with Common, Recent, Favorites and ten categories. Choose one to replace only this section. Outside click or Escape closes the grid. |
| Drag a category from the grid | Create a separate category window. |
| Divider with + | The entire line adds a Common section at that position. Middle separators stay gray; hover/focus shows the blue line and centered +. |
| Duplicate: click | Add a copy immediately below, inside the library. |
| Duplicate: drag | Create a copy and preview its insertion position in the library, or leave it floating outside. |
| Section grip: click | Collapse or expand that section. |
| Attached section: drag | Reorder it or detach it. The insertion preview moves neighboring sections and uses the dragged window's actual dimensions. |
| Floating window: drag | Move it from its surface, including symbol areas. Resize edges and the duplicate control retain their separate actions. |
| Floating grip: hold still | Return the section to the library after the configured hold delay (default 0.5 s). Simply aligning a floating window does not dock it. |
| Left/right edge | Resize horizontally, without starting a window move. |
| X | Remove this section/window. |

Ordinary symbol clicks insert into the active block and update Recent (up to 20 distinct symbols). **Alt + click** toggles Favorites without insertion. Insertion produces a gray wave from the click position; favoriting produces a yellow wave and temporarily suppresses the gray hover background. Collections and section layout persist in this browser. A copied section originating in the library uses the same ordering rules as an ordinary section drag.

**Hover** a symbol to see its meaning and alternatives. **Arrow Down** on a focused symbol opens the same window; **Escape** closes it. On touch screens, hold for the configured delay to open alternatives without inserting. Choosing an alternative inserts it. **?** opens the definition, examples, notations, references and validator-support information; X/Escape returns to the symbol window.

The **magnifying glass** opens search in the heading and focuses it. Search displays one deduplicated result grid across all categories, matching symbols, alternative forms and Portuguese/English names regardless of case or accents. An empty-state message explains when there are no matches. Escape or closing search clears the query and restores the existing sections. Search does not change their categories or order.

The library's main grip moves/collapses it; its title is centered between the grip and search. On desktop, arrow keys on a move grip move the window; Home or double-click on the main library grip restores its docked position. Narrow layouts stack windows. Restore defaults can reset the library arrangement while preserving Favorites, Recent and argument content.

## Movable, resizable panels

- **Move a panel:** press and hold for about **0.05 seconds** on an empty, noninteractive area, then drag. The movement cursor identifies available areas. Text, rows, buttons and logic results have their own interactions.
- **Resize horizontally:** drag the left or right edge. There is no vertical resize control; height follows the content.
- Panels snap near the horizontal center. Their horizontal position and width adapt proportionally when the sidebar opens/closes or the available viewport width changes. Width is constrained to the available workspace, including when interface scaling changes.
- If separated panels would collide because the upper one grows, the lower one moves down while preserving the chosen gap. When the upper one shrinks, the lower one moves back up. If you deliberately overlap them, this automatic separation does not change that arrangement.
- To move with the keyboard, focus the panel itself, rather than an input: **arrow keys** move it by 10 pixels; **Alt+arrow** moves by 1 pixel. **Shift+Left/Right** changes width.
- **Ctrl+Z** undoes recorded panel moves/resizes and row reordering. **Ctrl+Shift+Z** redoes them. On systems using Command, the corresponding modifier is supported. Inside an input, the browser's native text undo takes priority. Undo history is temporary and is not included in saved project files.

### Appearance and role labels

Role buttons default to **names**. Double-click cycles through names, names + symbols, and symbols; premise and conclusion buttons have equal sizes within each mode. A single click switches the role immediately. **∵ means “because” and is used only as an interface marker for premises; it is not a universal formal premise symbol and is not included in formulas or logical validation. ∴ means “therefore”.** Individual appearance defaults to the outer marker on, colored border off, and inner detail None. The detail list opens above the interface and does not pass scrolling to the page. Hold **Alt** while dragging an inner detail horizontally; without Alt, this area remains available for the normal row interactions. Keeping the mouse stationary there for the configured hover delay (default 0.5 seconds) shows an Alt hint. Neither the handle nor the hint is available for None. A weak 3 px snap aligns the detail with the eye column. Double-click the detail or press Home while focused to restore alignment. Click outside the appearance dialog to close it. General Settings contains an Appearance help hint explaining the eye-button hold.

## Argument preview, copy and export

The Argument updates as you write. The **numbered-list icon** (Number lines) toggles line numbering for the current argument. The **eye icons** independently collapse the editing area and the Argument contents; collapsing the sidebar does not toggle either eye.

**Copy** places the formatted argument on the clipboard, subject to the browser's clipboard permissions. **Export** opens a compact row with TXT, PDF and PNG above the button (below it when there is no room above):

| Format | Purpose | What it preserves |
| --- | --- | --- |
| `.txt` | Plain-text output | Formatted argument, symbols and the current numbering choice |
| `.pdf` | A document to view or print | Formatted argument rendered on A4 pages; long content wraps and continues onto more pages |
| `.lp.json` via the file menu | An editable backup | Row roles, text, argument names, numbering and proposition descriptions |

PNG captures the Argument panel as displayed, including its current theme, colors, border, lateral marker, text and button symbols, with a small margin for its shadow. Exporting from validation captures the normal Argument panel and keeps the dialog open. PDF pages contain rendered images, so their text is not selectable. Text and PDF exports do not include the validation report or proposition descriptions and cannot be imported as editable projects.

The **prefix-spacing button immediately to the right of numbering** joins prefix symbols to the following token in the formatted Argument: `¬ A` → `¬A`, `∀ x` → `∀x`, `∃ x` → `∃x`. Negation variants and modal prefixes are supported too. Infix connectives keep their spaces. The setting is reversible, is saved in this browser, and applies to the preview, copied text and TXT/PDF/PNG exports. It does not change the editable blocks, project data or validation support for quantifiers and modal logic.

## Proposition descriptions — beta

Open the **description icon in the editing panel's header**. It lists proposition names found in the argument and previously saved descriptions. Write a meaning such as `A: It is raining`, then save. Hover an exact matching proposition block to see its description. Cancel closes the form without applying changes.

**Descriptions annotate proposition symbols, not entire premise rows.** The description of `A` is shared wherever `A` occurs in that argument. Descriptions are saved per argument and included in `.lp.json` backups.

**Descriptions do not enter logical validation.** The validator treats `A` and `B` as independent propositional variables; it does not interpret the natural-language descriptions, check their factual truth, or infer a relationship between them. Semantic analysis of descriptions is a possible future direction, not an implemented feature.

## Validate logic — beta

The **shield with a check mark in the Argument footer** (Validate logic) opens a centered dialog with the live argument above the validation results. Its original numbering, prefix spacing, Copy and TXT/PDF/PNG Export controls remain available. Close or Escape restores the controls to the panel without changing the argument. While open, validation updates after edits. It checks **classical propositional consequence**: there must be no interpretation in which every premise is true and a conclusion is false.

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

Settings controls language (International English / Português do Brasil), four themes (Original light, Original dark, Indigo light and Indigo dark) and independent library/writing scales from **80% to 150%**, in 5% steps.

**Hover hints** have an enable switch and a delay from **0.01 to 1 second**, default **0.5 s**. Disabling them hides control/symbol/decoration hover help without disabling the controls. Hints use a shared rounded panel, can show keyboard shortcuts and proposition descriptions, respect viewport edges and close on interaction or Escape. Keyboard focus can also show help.

**Hold delay** is separate, with the same range/default. It controls panel appearance (eye buttons), blank-row conversion, delete-all confirmation, row selection, argument-tab ordering, touch symbol alternatives and returning a detached category. A small progress indicator fills beneath the control during the hold; releasing or moving cancels pending stationary holds. Changing hover delay does not change hold delay.

**Restore defaults** opens a preview of 19 settings and target values. Turn on **Preserve** beside any item to exclude it; all off resets the listed items, all on disables confirmation. Choices apply only to this confirmation. Cancel/Escape changes nothing. Numbering resets only the active argument; arguments, names and proposition descriptions are never deleted. Favorites/Recent survive a library-layout reset. Restoring panel layout and Reorganize windows use the first-visit arrangement: side by side from 1440 px and stacked on narrower screens. Reorganize preserves content and other preferences.

The Indigo themes use translucent surfaces and static blue/violet background glows, inspired by [Big Five](https://bigfive-test.com/). Theme selection is saved. Hold an empty background area for the configured hold delay to open the same four-theme chooser; moving cancels the gesture. Appearance also offers two panel-customization shortcuts, equivalent to holding each panel's eye button. Changing a panel color immediately updates its outer marker. Docked categories use the same compact margins as detached ones. Scrollbars and argument toolbar buttons follow the current theme. Settings has two tabs: Appearance groups themes, sizes and Reorganize windows; Functionalities groups the hover-hint switch, hint delay and hold-action delay.

First visits use the browser's Portuguese/English language (English fallback), a modus-ponens example, named role buttons, light theme, 100% scales, 0.5 s delays, uppercase typing, numbering and compact prefixes enabled. Soft panel colors, outer markers on, colored borders off and no inner detail are initial appearance choices. At 1440 px and above the writing/output panels start side by side; narrower screens stack them. Existing saved data/preferences are retained.

Controls have accessible labels and visible focus indicators. Narrow layouts adapt, and supported animations respect reduced-motion preferences. The Home button returns to the portfolio with one click.

## Opening the latest version

When opened online, the editor checks its published scripts and styles with a request that bypasses the browser cache. If they changed, it reloads once automatically before interaction; after interaction begins, an update notice lets you choose when to reload. Failed checks leave the current editor available. Local/offline use skips this check. Publishing and server-cache propagation can still take time; this check does not make an unfinished deployment available.

## Repository and implementation

`index.html` is the self-contained distribution containing HTML, CSS and JavaScript. Users need no installation or runtime dependencies: serve it on a static host or open it locally. Editable sources are organized by responsibility; a small Node generator assembles the single HTML. The `development/src/`, `development/tools/` and `development/tests/` directories contain the editable implementation, generator and regression suite. Edit those sources instead of appending patches to the generated HTML. This repository contains the editor; the separate portfolio menu links to it.

Where a browser exposes `document.modelContext.registerTool`, the editor can register a read-only `get_argument` tool returning the current rows, numbering and formatted text. Ordinary browser use does not require this optional integration.



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
5. Use o **ícone de arquivo no cabeçalho** para salvar um projeto que pode ser importado depois. Use **Exportar** no Argumento para gerar `.txt`, `.pdf` ou `.png`.

## Escrita em blocos

- Clique em qualquer bloco existente para editá-lo, inclusive antes do último. Os blocos seguintes são preservados.
- Cada linha contém blocos editáveis para nomes de proposições e conectivos. Os blocos acompanham o conteúdo; os nomes podem ter várias letras, como `Chove` ou `RuaMolhada`.
- **Espaço** avança de um bloco preenchido para o seguinte. Não insere um espaço dentro do nome de uma proposição.
- **Backspace ou Delete em um bloco vazio** remove o bloco imediatamente. Delete foca o próximo bloco na mesma posição; Backspace foca o anterior. Nas extremidades, o vizinho restante recebe o foco. Pelo menos um bloco editável é mantido.
- **Espaço** avança ao próximo bloco e cria um bloco vazio se não houver próximo. **Shift + Espaço** insere um bloco vazio imediatamente após o atual, sem substituir os blocos seguintes. **Alt + Espaço não é capturado pelo editor**.
- **Seta esquerda/direita no limite do texto** dá foco ao bloco vizinho; dentro do texto, mantém o movimento normal do cursor.
- **Enter** insere uma premissa depois da linha atual, exceto durante a seleção de linhas.
- **Tab** leva à próxima linha, com o cursor no fim do último bloco. **Shift+Tab** volta à linha anterior da mesma forma. Quando não há linha adjacente, vale a navegação normal de foco do navegador.
- O **ícone de Caps Lock (seta para cima sobre uma linha horizontal)** ativa ou desativa a conversão para maiúsculas durante a digitação seguinte; não reescreve todo o texto existente. Quando ativo, o fundo contrastante, o ícone mais marcado e o ponto indicador sinalizam a digitação em maiúsculas; a descrição do botão também informa o estado ativo.
- Clique em um bloco antes de escolher um símbolo no menu lateral. O símbolo entra no bloco ativo ou em um novo bloco depois de um bloco preenchido.

## Premissas, conclusões e linhas em branco

Clique em **Premissa / Conclusão** para alternar a função da linha. Conclusões aparecem com `∴` no Argumento formatado. É possível ter várias conclusões, verificadas separadamente.

Uma linha vazia gera uma linha em branco no Argumento e é ignorada na validação. Segure o botão **Premissa / Conclusão** por **tempo de segurar configurado (padrão: 0,5 segundo)** para transformar uma linha em branco preservando o texto. Esse texto continua editável, mas fica fora do Argumento e da validação. Um clique curto restaura a linha como premissa.

### Reordenar, selecionar e excluir

- **Arraste uma linha pelo texto ou por outra área disponível dela.** Não é necessário usar uma alça nem esperar: pressione e mova. Um clique normal continua permitindo editar. Botões de função, lixeira e seleção mantêm suas próprias ações.
- Segure uma linha parada pelo **tempo configurado (padrão: 0,5 s)** para ativar a seleção múltipla e selecioná-la. Segurar outra linha a adiciona à seleção; segurar uma já selecionada a mantém selecionada. Clique numa linha ou em sua caixa para alternar a seleção. Desmarcar a última linha encerra o modo automaticamente. Mover antes do tempo de segurar inicia o arraste imediato. Selecione várias linhas para arrastá-las juntas, preservando sua ordem, ou use **Excluir selecionadas**.
- **Segure a lixeira de uma linha por tempo de segurar configurado (padrão: 0,5 segundo)** para solicitar a exclusão de todas as premissas e conclusões do argumento aberto. As linhas afetadas são selecionadas antes da confirmação com traço vermelho no topo. Cancelar preserva as linhas e a seleção anterior; confirmar limpa apenas esse argumento, mantém uma linha editável vazia e permite desfazer. Mover antes do tempo de segurar inicia o arraste.
- Use a **lixeira** para excluir uma linha. Se ela estiver selecionada, a exclusão vale para o grupo selecionado. Conteúdo preenchido exige confirmação; linhas vazias podem ser removidas diretamente. O editor mantém pelo menos uma linha editável.
- As **setas de desfazer e refazer abaixo das linhas** recuperam operações registradas nas linhas, incluindo adição, exclusão e reordenação. Não substituem o desfazer de texto dentro dos campos.


O **+ abaixo das linhas** e as divisórias entre elas inserem uma premissa na posição escolhida. O + fica centralizado; criar linhas (inclusive por Enter) fica desativado durante a seleção. O arraste mostra uma prévia com cor suave, sem tracejado; a posição muda após sobreposição suficiente com a vizinha (65%), regra também aplicada às categorias.

## Vários argumentos e exemplos

O **+ no cabeçalho** abre duas opções: **Em branco** cria um argumento vazio imediatamente; **Exemplo** abre uma janela com prévias das fórmulas. O exemplo entra como um novo argumento, preservando os existentes. **Ajuda** nessa janela abre uma página offline com explicações dos exemplos atuais; a seta superior esquerda retorna à lista sem alterar seu argumento.

Os exemplos incluem modus ponens, modus tollens, silogismo disjuntivo, afirmação do consequente e fórmulas com nomes maiores de proposições. A afirmação do consequente demonstra deliberadamente uma inferência inválida.

Os argumentos usam abas com linha discreta no cabeçalho; o sublinhado identifica o argumento atual. As janelas de edição e prévia continuam movíveis de forma independente. A linha de inserção acima da primeira premissa aparece no hover/foco, adiciona uma premissa no início e permite desfazer; fica indisponível durante a seleção de linhas. A linha superior dos símbolos aparece apenas no hover/foco e se sobrepõe à margem, preservando espaçamentos superior e inferior iguais. A navegação centralizada tem um botão à esquerda para alternar entre abas e seletor compacto, com transição suave. Os dois modos permanecem centralizados e mantêm o argumento atual. A preferência de visualização fica salva neste navegador; o modo compacto usa um menu arredondado e oferece renomear à esquerda e excluir à direita dentro de cada item do menu no hover ou foco pelo teclado (sempre visíveis no toque). O menu compacto tem uma superfície central estreita; editar/excluir aparecem em botões arredondados separados, fora das bordas esquerda/direita, ao lado do item sob hover ou foco. Separadores suaves, incluindo um acima do primeiro argumento e acima da primeira categoria de símbolos, revelam um + centralizado no hover ou foco pelo teclado; clicar insere um argumento em branco naquela posição, preservando a ordem e o conteúdo existentes. Não há controles de editar/excluir ao lado do seletor fechado. As ações das abas flutuam abaixo do título no hover ou foco pelo teclado, sem reservar espaço vertical ou lateral nem aumentar a altura do cabeçalho. Premissas usam azul suave e conclusões verde suave por padrão. Segure o olhinho de um painel pelo **tempo configurado (padrão: 0,5 s)** para abrir sua janela individual de aparência. Ela oferece amostras e um seletor completo de cores; a escolha também altera as faixas laterais dos painéis, fica salva neste navegador e é restaurada pelo botão de padrão. Botões de lixeira deslizam de trás do botão de tipo ao passar o mouse ou focar a linha pelo teclado. Ficam vermelhos no hover e permanecem visíveis em dispositivos de toque. Converter a linha em branco preserva a posição e a área de clique da lixeira; o controle de tipo invisível mantém toda a área de clique para voltar a premissa. Apenas a caixa visível da lixeira responde aos cliques de exclusão; a margem mantém o hover sem excluir. Caixas e destaques de seleção começam na coluna do título, sem cobrir as decorações internas. Cada painel possui seu próprio interruptor Borda colorida, usando sua cor. A escolha fica salva neste navegador. A seção Aparência permite ocultar o traço externo e escolher o detalhe interno: degradê suave, nenhum, rebaixo, conexões curvas, ondulação suave, cantos internos, numeração discreta, cor no hover, linha segmentada, cápsula vertical, arcos por linha ou luz localizada. Os detalhes das linhas acompanham adições e reordenação. O botão de lixeira também permite arrastar a linha; segurar por tempo de segurar configurado (padrão: 0,5 segundo) solicita excluir todas as linhas do argumento atual. O clique curto exclui a linha ou seleção atual. Clique em uma aba para trocar de argumento. O **lápis** renomeia; deixe o nome vazio para recuperar a nomenclatura automática. O **X** exclui, com confirmação se houver conteúdo. Esses controles aparecem com o mouse sobre a aba ou com foco pelo teclado e ficam visíveis em telas com toque. **Segure uma aba por tempo de segurar configurado (padrão: 0,5 segundo) e arraste** para reordenar os argumentos. Os nomes automáticos acompanham as posições.

Cada argumento conserva suas linhas, escolha de numeração e descrições de proposições. A disposição dos painéis e as configurações de interface pertencem ao espaço de trabalho.

## Biblioteca de símbolos e busca

A biblioteca contém conectivos proposicionais, implicação/equivalência, quantificadores/igualdade, operadores modais, dedução/consequência, operações de conjuntos, relações entre conjuntos, operadores sobre famílias, comparação/definição e delimitadores. **A notação disponível é mais ampla que a validação proposicional clássica.**

Cada seção tem alça de mover/recolher, seletor de categoria, duplicação e fechamento. Categorias podem se repetir; fechar uma seção não apaga argumentos nem favoritos.

| Controle ou gesto | Comportamento |
| --- | --- |
| Seletor de categoria | Clique abre/fecha uma grade centralizada com Comuns, Recentes, Favoritos e dez categorias. A escolha altera somente esta seção. Clique fora ou Escape fecha a grade. |
| Arrastar categoria da grade | Cria uma janela separada dessa categoria. |
| Divisória com + | Toda a linha adiciona uma seção de Mais comuns naquela posição. As separações intermediárias permanecem cinzas; hover/foco mostra linha azul e + centralizado. |
| Duplicar: clique | Acrescenta uma cópia imediatamente abaixo, dentro da biblioteca. |
| Duplicar: arraste | Cria uma cópia com prévia da posição de inserção na biblioteca, ou a deixa flutuante fora dela. |
| Alça da seção: clique | Recolhe ou expande a seção. |
| Seção acoplada: arraste | Reordena ou desacopla. A prévia desloca as seções vizinhas e usa as dimensões reais da janela arrastada. |
| Janela flutuante: arraste | Move pela superfície, inclusive pela área dos símbolos. Bordas de redimensionamento e controle de duplicação preservam suas ações próprias. |
| Alça flutuante: segurar sem mover | Retorna à biblioteca após o tempo configurado (padrão: 0,5 s). Alinhar a janela flutuante não a acopla automaticamente. |
| Borda esquerda/direita | Alarga ou estreita sem iniciar o movimento da janela. |
| X | Remove somente aquela seção/janela. |

O clique normal insere no bloco ativo e atualiza Recentes (até 20 símbolos distintos). **Alt + clique** alterna Favoritos sem inserir. Inserir produz onda cinza a partir da posição do clique; favoritar produz onda amarela, suspendendo o fundo cinza de hover durante a animação. Coleções e disposição ficam salvas neste navegador. A cópia arrastada a partir da biblioteca segue as mesmas regras de ordenação do arraste normal.

**Hover** sobre um símbolo mostra significado e alternativas. **Seta para baixo** com foco abre a mesma janela; **Escape** fecha. Em tela de toque, segure pelo tempo configurado para abrir as alternativas sem inserir. Escolher uma notação a insere. **?** abre definição, exemplos, notações, referências e informação de suporte pelo validador; X/Escape retorna à janela do símbolo.

A **lupa** abre a busca no cabeçalho e dá foco ao campo. A busca mostra uma grade única, sem duplicatas, de todas as categorias: símbolos, formas alternativas e nomes em português/inglês, sem distinguir caixa ou acentos. Uma mensagem indica ausência de resultados. Escape ou fechar a busca limpa o filtro e restaura as seções existentes, sem alterar suas categorias ou ordem.

A alça principal move/recolhe a biblioteca; o título fica centralizado entre ela e a busca. No desktop, setas com foco na alça movem a janela; Home ou duplo clique na alça principal restaura a biblioteca acoplada. Telas estreitas empilham as janelas. Restaurar padrões pode redefinir a disposição sem apagar Favoritos, Recentes ou argumentos.

## Painéis movíveis e redimensionáveis

- **Mover um painel:** pressione e segure por aproximadamente **0,05 segundo** em uma área vazia, sem interação, e arraste. O cursor de movimento identifica áreas disponíveis. Textos, linhas, botões e resultados lógicos têm suas próprias interações.
- **Alterar a largura:** arraste a borda esquerda ou direita. Não há redimensionamento vertical; a altura acompanha o conteúdo.
- Os painéis se alinham ao se aproximarem do centro horizontal. Sua posição horizontal e largura se adaptam proporcionalmente quando o menu lateral abre/fecha ou a largura disponível muda. A largura fica limitada ao espaço de trabalho, inclusive após alterações de escala da interface.
- Se painéis separados forem colidir porque o superior cresceu, o inferior desce preservando o intervalo escolhido. Quando o superior diminui, o inferior volta a subir. Se você os sobrepuser deliberadamente, a separação automática não altera essa disposição.
- Pelo teclado, foque o próprio painel, não um campo: as **setas** movem 10 pixels; **Alt+seta** move 1 pixel. **Shift+Esquerda/Direita** altera a largura.
- **Ctrl+Z** desfaz movimentos/redimensionamentos registrados dos painéis e reordenações das linhas. **Ctrl+Shift+Z** refaz. O modificador Command correspondente também é aceito em sistemas que o utilizam. Dentro de um campo, o desfazer nativo de texto tem prioridade. O histórico é temporário e não acompanha os arquivos de projeto.

### Aparência e identificação das linhas

Os botões de tipo usam **nomes** por padrão em novos acessos. O duplo clique alterna entre nomes, nomes + símbolos e símbolos; premissa e conclusão têm dimensões iguais em cada modo. O clique simples troca o tipo imediatamente. **∵ significa “porque” e serve somente como identificação visual de premissas nesta interface; não é um símbolo formal universal de premissa e não integra as fórmulas nem a validação lógica. ∴ significa “portanto”.** A aparência individual tem como padrão o traço externo ligado, borda colorida desligada e detalhe interno Nenhum. A lista abre acima da interface e seu scroll não passa para a página. Segure **Alt** ao arrastar os detalhes internos horizontalmente; sem Alt, a região fica disponível para as interações normais das linhas. Parar o mouse ali pelo tempo de hover configurado (padrão de 0,5 segundo) exibe uma dica sobre Alt. A alça e a dica não ficam disponíveis em Nenhum. Um encaixe fraco de 3 px alinha à coluna do olho. Duplo clique no detalhe ou Home com foco restaura o alinhamento. Clique fora da janela de aparência para fechar. Nas configurações gerais, a ajuda em Aparência explica como segurar o olhinho.

## Prévia do Argumento, cópia e exportação

O Argumento se atualiza durante a escrita. O **ícone de lista numerada** (Numerar linhas) alterna a numeração do argumento atual. Os **olhos** recolhem a área de edição e o conteúdo do Argumento de forma independente; recolher o menu lateral não altera esses controles.

**Copiar** envia o argumento formatado para a área de transferência, conforme as permissões do navegador. **Exportar** abre uma faixa compacta com TXT, PDF e PNG acima do botão (abaixo quando falta espaço acima):

| Formato | Finalidade | O que preserva |
| --- | --- | --- |
| `.txt` | Saída em texto simples | Argumento formatado, símbolos e escolha atual de numeração |
| `.pdf` | Documento para visualizar ou imprimir | Argumento renderizado em páginas A4; conteúdo longo quebra linhas e continua em novas páginas |
| `.lp.json` pelo menu de arquivo | Cópia de segurança editável | Funções das linhas, texto, nomes dos argumentos, numeração e descrições de proposições |

PNG captura o painel do Argumento como aparece, incluindo tema, cores, borda, marcador lateral, texto e símbolos dos botões, com uma pequena margem para a sombra. A exportação pela validação captura o painel normal do Argumento e mantém a janela aberta. As páginas do PDF contêm imagens renderizadas; o texto não é selecionável. Exportações em texto e PDF não incluem o relatório de validação nem as descrições de proposições e não podem ser importadas como projetos editáveis.

O **botão de espaçamento de prefixos, imediatamente à direita da enumeração**, une símbolos de prefixo ao próximo token na apresentação do Argumento: `¬ A` → `¬A`, `∀ x` → `∀x`, `∃ x` → `∃x`. Também contempla variantes de negação e prefixos modais. Conectivos infixos mantêm seus espaços. A opção é reversível, fica salva neste navegador e vale na prévia, na cópia e nas exportações de texto/PDF. Não altera os blocos editáveis, os dados do projeto nem o suporte da validação a quantificadores e lógica modal.

## Descrições de proposições — beta

Abra o **ícone de descrição no cabeçalho do painel de edição**. Ele lista nomes de proposições encontrados no argumento e descrições já salvas. Escreva um significado, como `A: Está chovendo`, e salve. Passe o mouse sobre um bloco com o nome exato para ver a descrição. Cancelar fecha sem aplicar mudanças.

**As descrições anotam símbolos de proposições, não linhas inteiras de premissas.** A descrição de `A` vale onde `A` aparecer naquele argumento. Elas são salvas por argumento e incluídas nas cópias `.lp.json`.

**As descrições não entram na validação lógica.** O validador trata `A` e `B` como variáveis proposicionais independentes; não interpreta suas descrições em linguagem natural, verifica sua verdade factual ou infere relações entre elas. Analisar o significado das descrições é uma possível direção futura, não uma função implementada.

## Validar lógica — beta

O **escudo com uma marca de verificação junto ao título Argumento** (Validar lógica) abre uma janela centralizada com o argumento acima dos resultados. Numeração, espaçamento de prefixos, Copiar e Exportar TXT/PDF continuam disponíveis. Fechar ou Escape devolve os controles ao painel sem alterar o argumento. Enquanto aberta, a validação se atualiza após alterações. A verificação considera **consequência proposicional clássica**: não pode existir uma interpretação em que todas as premissas sejam verdadeiras e uma conclusão seja falsa.

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

As configurações controlam idioma (International English / Português do Brasil), quatro temas (Claro original, Escuro original, Índigo claro e Índigo escuro) e escalas independentes da biblioteca e da escrita: **80% a 150%**, em passos de 5%.

**Dicas de hover** têm interruptor e tempo entre **0,01 e 1 segundo**, padrão **0,5 s**. Desligá-las oculta as ajudas dos controles, símbolos e decorações sem desativar as funções. Usam janela arredondada compartilhada, podem incluir atalhos e descrições das proposições, respeitam a tela e fecham ao interagir ou por Escape. O foco pelo teclado também pode mostrar ajuda.

**Tempo de segurar** é independente, com a mesma faixa/padrão. Vale para aparência pelos olhinhos, conversão em linha em branco, confirmação de excluir tudo, seleção de linhas, reordenação de abas, alternativas dos símbolos por toque e retorno de categoria desacoplada. Um indicador sob o controle preenche durante o gesto; soltar ou mover cancela os toques estacionários pendentes. Alterar o hover não altera esse tempo.

**Restaurar padrões** abre uma prévia de 19 ajustes com os valores de destino. Ative **Preservar** junto ao que deve permanecer; todos desligados restaura os ajustes listados, todos ligados desabilita a confirmação. A escolha vale somente naquela confirmação. Cancelar/Escape não altera nada. A enumeração muda apenas no argumento ativo; argumentos, nomes e descrições nunca são apagados. Favoritos/Recentes sobrevivem ao reset da disposição da biblioteca.

Os temas Índigo usam superfícies translúcidas e manchas estáticas azul-violeta no fundo, inspirados no [Big Five](https://bigfive-test.com/). A escolha é salva. Segurar uma área vazia do fundo pelo tempo configurado abre a mesma escolha dos quatro temas; mover cancela o gesto. Aparência também oferece dois atalhos de personalização dos painéis, equivalentes a segurar cada olhinho. A cor do marcador externo acompanha imediatamente a cor do painel. Categorias acopladas usam as mesmas margens compactas das destacadas. Barras de rolagem e botões do argumento acompanham o tema. Reset da disposição e Reorganizar janelas usam a disposição do primeiro acesso: lado a lado a partir de 1440 px e empilhadas em telas menores, sem apagar os argumentos. As configurações têm duas abas: Aparência reúne temas, tamanhos e Reorganizar janelas; Funcionalidades reúne o toggle de dicas de hover, o tempo das dicas e o tempo de toque longo.

O primeiro acesso usa o idioma português/inglês do navegador (inglês como alternativa), exemplo de modus ponens, botões de tipo com nomes, tema claro, escalas 100%, tempos 0,5 s, maiúsculas, enumeração e prefixos compactos ligados. Cores suaves, traços externos ligados, bordas coloridas desligadas e detalhe interno Nenhum são os valores iniciais. A partir de 1440 px, escrita e resultado começam lado a lado; abaixo disso ficam empilhados. Dados e preferências já salvos são preservados.

Controles têm rótulos acessíveis e foco visível. A disposição se adapta a telas estreitas, e as animações contempladas respeitam movimento reduzido. Home retorna ao portfólio com um clique.

## Abrir a versão atual

Ao abrir online, o editor verifica os scripts e estilos publicados por uma requisição que evita o cache do navegador. Se mudaram, recarrega uma vez automaticamente antes da interação; depois que a interação começa, um aviso permite escolher quando atualizar. Falhas na consulta mantêm o editor atual disponível. O uso local/offline não faz essa consulta. A publicação e a propagação do cache do servidor ainda podem levar tempo; a consulta não disponibiliza uma publicação ainda incompleta.

## Repositório e implementação

`index.html` é a distribuição autossuficiente com HTML, CSS e JavaScript. Quem utiliza o site não precisa instalar dependências: basta hospedá-lo ou abrir localmente. Os fontes editáveis estão organizados por responsabilidade; um pequeno gerador em Node reúne o HTML único. As pastas `development/src/`, `development/tools/` e `development/tests/` contêm a implementação editável, o gerador e a suíte de regressão. Edite esses fontes em vez de acrescentar correções ao HTML gerado. Este repositório contém o editor; o menu de projetos separado aponta para ele.

Quando o navegador oferece `document.modelContext.registerTool`, o editor pode registrar a ferramenta de leitura `get_argument`, que retorna linhas atuais, numeração e texto formatado. O uso normal no navegador não exige essa integração opcional.



## Créditos e autoria

Concebido e dirigido por **toybile**, desenvolvido com o **OpenAI Codex**. As decisões de interface, os requisitos das funções e a direção do projeto foram definidos por toybile; o Codex auxiliou na implementação do código e na documentação.

As explicações dos símbolos apontam para suas referências educacionais. As obras referenciadas mantêm suas respectivas autorias e licenças.

## Licença

Este projeto é distribuído sob a **licença MIT**. Consulte [LICENSE](LICENSE) para os termos completos. Preserve os avisos de direitos autorais e de licença ao redistribuir o código abrangido. Obras de terceiros mantêm seus próprios termos.

</details>

## Verification / Verificação

Local audit: 18 October 2026. Browser checks cover editing, row operations, library selection/search, favorites, duplication/ordering, resize, configured hold timing, hints, validation, persistence, import and TXT/PDF downloads. Passing checks establish the tested cases, not absence of all defects. Clipboard permissions, optional browser integrations and remote hosting depend on their environment.

Auditoria local: 18 de outubro de 2026. Os testes de navegador abrangem edição, linhas, seleção/busca de símbolos, favoritos, duplicação/ordenação, redimensionamento, tempo configurado de segurar, dicas, validação, persistência, importação e downloads TXT/PDF. Aprovação dos casos testados não demonstra ausência de todo defeito. Permissões de área de transferência, integrações opcionais e hospedagem dependem do ambiente.









Panel customization opened from Settings keeps Settings open. Inner detail and its selector share one row.
A personalização aberta pelas Configurações mantém as Configurações abertas. Detalhe interno e seu seletor ficam na mesma linha.

Windows appear with a short staggered scale-and-settle animation on entry and reload. Interaction cancels it immediately. The system preference for reduced motion disables it.
As janelas surgem com uma animação breve de crescimento e estabilização ao entrar ou recarregar. Interagir a interrompe imediatamente. A preferência do sistema por movimento reduzido a desativa.

First visit, Reset and Reorganize windows show the docked Most common symbol category expanded. Panel customization closes on outside click or Escape, toggles off with its own shortcut, and switches when the other panel shortcut is clicked. Settings controls remain usable; closing Settings removes its customization window.
Primeira visita, Restaurar padrões e Reorganizar janelas mostram a categoria Mais comuns aberta na biblioteca. A personalização fecha ao clicar fora ou pressionar Escape; clicar no mesmo atalho a fecha e clicar no outro substitui o painel. Os controles das configurações continuam acessíveis; fechar as configurações remove sua janela de personalização.

The Argument header stays on one row; its minimum window width follows its controls, language and writing scale. Pointer and keyboard resizing respect this minimum, and the initial layout allocates enough room. On narrow screens, header controls wrap without horizontal scrolling. Validate logic retains its beta badge. Symbol-category dividers appear only on hover/focus; library top and bottom margins gain 3px. Entrance pauses through pointer presses to preserve clicks.
O cabeçalho do Argumento permanece em uma linha; a largura mínima acompanha os controles, o idioma e a escala de escrita. Redimensionar por mouse e teclado respeita esse limite, e a disposição inicial reserva espaço suficiente. Em telas estreitas, os controles se organizam em novas linhas sem rolagem horizontal. Validar lógica mantém a tarja beta. As divisórias das categorias aparecem somente em hover/foco; as margens superior e inferior da biblioteca aumentam 3px. A entrada pausa durante o clique para preservar a interação.

Information icons beside Themes and Customize panels show the background-hold and panel-customization instructions on hover or keyboard focus. Inline explanatory paragraphs are removed. Dialogs use balanced 20px insets (16px on small screens), border-box sizing and consistent close-button alignment. Fields stay within their dialogs; import checkboxes remain centered and square.
Ícones de informação junto de Temas e Personalizar painéis mostram as instruções do fundo e dos painéis em hover ou foco de teclado. Os parágrafos explicativos fixos foram removidos. As janelas usam margens internas equilibradas de 20px (16px em telas pequenas), dimensões que incluem bordas e alinhamento uniforme dos botões de fechar. Os campos permanecem dentro das janelas; as caixas de seleção da importação ficam quadradas e centralizadas.

The Argument and Premises panels share the same header top spacing and collapsed height. Closing the Argument eye button also hides and disables Validate logic; reopening restores it. These states persist after reload. Header minimum sizes account for both panels so scaled controls remain aligned.
Argumento e Premissas compartilham a margem superior do cabeçalho e a altura quando recolhidos. Fechar o olhinho do Argumento também oculta e desativa Validar lógica; reabrir o restaura. Esses estados persistem ao recarregar. As larguras mínimas consideram os dois painéis para manter os controles ampliados alinhados.

Copy and export confirmations use the same bottom notification as symbol favorites, including inside validation. Export opens a floating top-layer format picker centered below its button, with viewport clamping and keyboard support; it does not resize or scroll the Argument panel. Validation has no divider above the argument toolbar.
As confirmações de cópia e exportação usam a mesma notificação inferior dos favoritos de símbolos, inclusive dentro da validação. Exportar abre uma seleção flutuante sobre a página, centralizada abaixo do botão, com limites de tela e suporte ao teclado; ela não redimensiona nem faz rolar o painel de Argumento. A validação não tem divisória acima dos controles do argumento.

Eight themes are available: Original light/dark, Indigo light/dark, Petroleum and turquoise, Graphite and amber, Sand and blue, and Sage and olive. Theme choices persist after reload and share the same Settings/background picker. Panel customization includes a rainbow color circle next to the presets; click or focus its native color control to choose any color. The center shows the current color, with no additional visible instructions. Validation toolbar uses the same inner inset on all sides.
Há oito temas: Claro/Escuro originais, Índigo claro/escuro, Petróleo e turquesa, Grafite e âmbar, Areia e azul e Sálvia e oliva. A escolha persiste ao recarregar e é compartilhada entre as Configurações e o seletor aberto pelo fundo. A personalização dos painéis tem um círculo multicolorido junto às cores predefinidas; clique ou acesse seu controle nativo pelo teclado para escolher qualquer cor. O centro mostra a cor atual, sem textos adicionais visíveis. Os controles da validação usam margens internas equivalentes.


Themes in Settings expands and collapses with a smooth animation, respecting reduced motion. Light themes occupy the left column and dark themes the right; the collapsed state persists after reload. All eight themes remain available.
A seção Temas nas Configurações abre e fecha com animação suave, respeitando a preferência por movimento reduzido. Os temas claros ficam à esquerda e os escuros à direita; o estado recolhido persiste ao recarregar. Os oito temas continuam disponíveis.


On phones and narrow tablets (up to 900px, or 1100px with touch), panels stack and retain their desktop arrangement for larger screens. Formula blocks use the full row width, with a dedicated touch grip for reordering and stable delete buttons. Software keyboards can advance blocks with Space and add rows with Enter; input fields disable automatic correction for formulas. Hold a symbol to access its forms, explanation and a touch favorite button. Settings information icons also open by tapping. Dialogs follow the visual viewport while the software keyboard is open.
Em celulares e tablets estreitos (até 900px, ou 1100px com toque), os painéis ficam empilhados e preservam a disposição de computador para telas maiores. Os blocos usam toda a largura da linha, com alça própria para reordenar por toque e lixeiras estáveis. O teclado virtual pode avançar blocos com Espaço e adicionar linhas com Enter; a correção automática é desativada nas fórmulas. Segure um símbolo para acessar suas formas, explicação e botão de favorito por toque. Os ícones informativos das configurações também abrem ao tocar. As janelas acompanham a área visível quando o teclado está aberto.


Writing can switch between blocks and a continuous formula field, using the editor header button or Settings → Functionalities → Writing mode. Continuous writing keeps ordinary text selection and places library symbols at the caret. Switching modes keeps the argument; the choice persists. Prefix spacing also compacts parentheses and predicate application, for example F ( x ) → F(x), while keeping spaces around binary operators. Delete in an empty block keeps the same position by focusing the next available block; Backspace returns to the previous one. The background covers the dynamic viewport after fullscreen/resizing, even after moving library windows.
A escrita pode alternar entre blocos e um campo contínuo de fórmula, pelo botão no cabeçalho do editor ou por Configurações → Funcionalidades → Modo de escrita. A escrita contínua mantém a seleção normal de texto e insere os símbolos da biblioteca na posição do cursor. Alternar preserva o argumento; a escolha persiste. O Prefix spacing também compacta parênteses e aplicação de predicados, por exemplo F ( x ) → F(x), mantendo os espaços entre operadores binários. Delete em bloco vazio mantém a posição ao focar o próximo bloco disponível; Backspace retorna ao anterior. O fundo acompanha a área da tela ao entrar/sair da tela cheia e redimensionar, mesmo após mover janelas da biblioteca.

In continuous writing, drag vertically from inside the formula to reorder a row, with mouse or touch. Holding still selects the held row; further holds add rows, and deselecting the last one exits selection mode. Horizontal dragging keeps text selection. Blocks remain available.

Na escrita contínua, arraste verticalmente de dentro da fórmula para reordenar uma linha, com mouse ou toque. Segurar sem mover seleciona a linha pressionada; novos toques longos adicionam linhas, e desmarcar a última encerra a seleção. O arraste horizontal mantém a seleção de texto. Os blocos continuam disponíveis.

Panel controls keep titles and visibility buttons on the left and auxiliary controls on the right. The editor footer separates Add from Undo/Redo; the standalone selection button was removed.

Os painéis mantêm títulos e olhinhos à esquerda e os controles auxiliares à direita. O rodapé do editor separa Adicionar de Desfazer/Refazer; o botão avulso de seleção foi retirado.

The selected arrangement keeps writing/formatting adjustments in the panel headers and actions in the footers. Validation, Copy and Export share the Argument footer. Button symbols are unchanged.

A disposição escolhida mantém os ajustes de escrita/formatação nos cabeçalhos e as ações nos rodapés. Validação, Copiar e Exportar ficam no rodapé do Argumento. Os símbolos dos botões foram preservados.


## Development / Desenvolvimento

The published entry point is `index.html`. Edit the files in `development/src/`, then rebuild.
O arquivo publicado é `index.html`. Edite os arquivos em `development/src/` e gere o site novamente.

Requirements / Requisitos: Node.js 22 or newer and npm.

```sh
cd development
npm ci
npm run browsers:install
npm run build
npm run check
npm test
```

`npm ci` installs the versions recorded in `package-lock.json`. Browser installation is needed for browser tests, not for building or using the site.
`npm ci` instala as versões registradas em `package-lock.json`. A instalação do navegador é necessária para os testes, não para gerar ou usar o site.

- `development/src/template.html`: page structure / estrutura da página.
- `development/src/manifest.json`: source inclusion order / ordem de inclusão dos arquivos.
- `development/src/styles/`: presentation and themes / aparência e temas.
- `development/src/scripts/`: editing, symbols, settings, validation and workspace behavior / edição, símbolos, configurações, validação e argumentos.
- `development/tools/build.cjs`: generates the standalone `index.html` / gera o `index.html` autônomo.
- `development/tools/check-source.cjs`: checks JavaScript syntax and specific ownership/duplication rules / verifica sintaxe JavaScript e regras específicas contra duplicações e sobreposições.
- `development/tests/cases.json`: registered regression suites / testes de regressão registrados.
- `development/tests/run.cjs`: runs all registered suites, or the suite names passed as arguments / executa os testes registrados ou os nomes passados como argumentos.

From `development/`, for focused checks / Dentro de `development/`, para testes direcionados:

```sh
node tests/run.cjs check-writing-defaults-desktop check-descriptions-fonts-desktop
npm run test:exports
```

Tests use Playwright Chromium by default. `LP_CHROME_PATH` can optionally point to another compatible browser executable; no machine-specific path is stored in this repository. Screenshots and test results are written to ignored `test-artifacts/`.
Os testes usam o Chromium do Playwright por padrão. Opcionalmente, `LP_CHROME_PATH` permite indicar outro navegador compatível; nenhum caminho específico de computador é armazenado no repositório. Capturas e resultados ficam em `test-artifacts/`, fora do Git.

Classic scripts intentionally share browser scope and follow manifest order. This build does not bundle external runtime dependencies. Existing mobile styles and regression tests are retained; they do not imply new mobile development.
Os scripts compartilham o escopo do navegador e seguem a ordem do manifesto. O site gerado não depende das ferramentas de desenvolvimento instaladas. Os estilos e testes de celular existentes são preservados; isso não implica novas adaptações para celular.


## Logical modes / Modos lógicos

Use the selector below the Logic Editor title to choose a logical mode for the current argument. Hold it, or choose About the modes, to open the introduction. All symbols remain available. Only classical propositional validation is currently implemented; categorical syllogistic and first-order modes preserve the argument and explicitly report that their validators are still in development. Symbol descriptions remain free annotations, not a formal interpretation. The mode is saved with the argument and included in workspace files.

Use o seletor abaixo do título do editor para escolher o modo lógico do argumento atual. Segure, ou escolha Conhecer os modos, para abrir a introdução. Todos os símbolos continuam disponíveis. Somente a validação proposicional clássica está implementada; os modos de silogística categórica e primeira ordem preservam o argumento e informam que seus verificadores estão em desenvolvimento. As descrições continuam sendo anotações livres, não uma interpretação formal. O modo é salvo com o argumento e incluído nos arquivos de trabalho.

Argument tabs respond to a short click without waiting for the hold duration. Their hold indicator appears only after a brief initial delay; the configured duration of the hold action is unchanged.
As abas de argumentos respondem ao clique curto sem aguardar o tempo de segurar. O indicador só aparece após um breve intervalo inicial; o tempo configurado para a ação permanece igual.
