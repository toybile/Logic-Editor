# Propositional Logic Editor

**English** · [Português (Brasil)](README.pt-BR.md)

[Open the editor](https://toybile.github.io/Propositional-Logic-Editor/)

A browser workspace for writing and organizing logical arguments. Combine premises and conclusions, insert logical symbols, and copy or export the resulting argument as plain text.

The purpose is to make notation and formatting easier. The editor does not check argument validity or generate proofs or truth tables.

## Getting started

Open index.html in a modern browser. No installation, account, or server is required. The interface supports Brazilian Portuguese and International English, light and dark themes, and mobile layouts.

1. Write in the premise and conclusion rows. Use the button on the left to switch a row's role.
2. Choose symbols from the grouped sidebar. Open **All notations** to use alternative representations of an operator.
3. Add rows, reorder them using the drag handle, and remove them using the trash button.
4. An empty row creates a blank line in the Argument, even when marked as **Premise** or **Conclusion**. If the row contains text, hold the Premise/Conclusion button for **0.3 seconds** to represent it as a blank line in the Argument. Its text is preserved but hidden; a short click restores the row as a premise.
5. Enable **Numbers** if needed, then use **Copy** or **Export**. Export downloads a .txt file.

## Multiple arguments

Use **+** in the top bar to create an argument. Select a tab to switch arguments; use its pencil to rename it or its X to delete it. Deleting an argument containing text requires confirmation. Drag tabs to reorder them. Automatic names follow their current positions, including positions occupied by custom names.

## Workspace controls

- Collapse the symbol sidebar for more writing space.
- Use the eye controls to show or hide the writing area and argument preview.
- Open settings to change language, theme, sidebar size, and writing size.
- Symbol groups are collapsible; the arrow opens alternative notations, including on mobile.
- A temporary trailing space facilitates typing and is removed after five seconds without typing.

## Saving your work

Arguments and preferences are saved automatically in this browser using localStorage. There is no cloud synchronization: another browser, device, or website address has separate data. Clearing site data can remove saved arguments. Export important work as text for a separate backup; text export is not a project import format.

## Project structure

index.html contains the editor's HTML, styles, and JavaScript. This repository contains only the editor, without the portfolio menu. To publish it on a static host, serve this file as the root page.
