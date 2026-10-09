# Editor de Lógica Proposicional

[English](README.md) · **Português (Brasil)**

[Abrir o editor](https://toybile.github.io/Propositional-Logic-Editor/)

Um espaço no navegador para escrever e organizar argumentos lógicos. Combine premissas e conclusões, insira símbolos e copie ou exporte o argumento resultante como texto.

O intuito é facilitar a notação e a formatação. O editor não verifica a validade de argumentos nem gera provas ou tabelas-verdade.

## Como começar

Abra index.html em um navegador moderno. Não é necessário instalar dependências, criar conta ou executar um servidor. A interface oferece português brasileiro e inglês internacional, temas claro e escuro e adaptação para celulares.

1. Escreva nas linhas de premissas e conclusões. Use o botão à esquerda para alternar a função da linha.
2. Escolha símbolos na biblioteca organizada em grupos. Abra **Todas as notações** para usar outras representações de um operador.
3. Adicione linhas, arraste-as pela alça para mudar a ordem e remova-as pela lixeira.
4. Segure o botão da função da linha por **0,3 segundo** para transformá-la em uma linha vazia proposital. O texto permanece guardado, mas oculto; um clique curto restaura a linha como premissa.
5. Marque **Números**, se desejar, e use **Copiar** ou **Exportar**. A exportação baixa um arquivo .txt.

## Vários argumentos

Use **+** na barra superior para criar um argumento. Selecione uma aba para alternar entre argumentos; use o lápis para renomear ou o X para apagar. A exclusão de argumentos com texto pede confirmação. Arraste as abas para reordená-las. Os nomes automáticos acompanham a posição atual, incluindo as posições ocupadas por argumentos com nomes personalizados.

## Controles da interface

- Recolha a biblioteca de símbolos para ampliar o espaço de escrita.
- Use os olhinhos para mostrar ou ocultar a área de escrita e a prévia do argumento.
- Abra as configurações para alterar idioma, tema e tamanho da biblioteca e da escrita.
- Os grupos de símbolos são recolhíveis; a seta abre as notações alternativas, inclusive no celular.
- Um espaço temporário no fim do texto facilita a digitação e é removido após cinco segundos sem digitar.

## Guardar seu trabalho

Argumentos e preferências são salvos automaticamente neste navegador com localStorage. Não existe sincronização na nuvem: outro navegador, dispositivo ou endereço tem dados separados. Limpar os dados do site pode apagar os argumentos salvos. Exporte trabalhos importantes como texto para manter uma cópia separada; essa exportação não é um formato para importar projetos.

## Estrutura do projeto

index.html reúne o HTML, os estilos e o JavaScript do editor. Este repositório contém somente o editor, sem o menu do portfólio. Para publicá-lo em uma hospedagem estática, sirva esse arquivo como página inicial.
