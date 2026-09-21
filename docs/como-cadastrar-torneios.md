# Como cadastrar um torneio

Este guia é para quem administra a loja/site (não precisa saber programar).
Publicar um torneio é editar um arquivo de texto e fazer o commit — o site
é gerado e publicado sozinho depois disso.

## Passo a passo rápido

1. Copie `data/tournaments/_template.yml` para um novo arquivo na mesma
   pasta, com um nome curto e sem espaços (ex: `data/tournaments/copa-de-verao.yml`).
   O nome do arquivo vira o endereço da página do torneio no site
   (`copa-de-verao.yml` → `seusite.com/tournaments/copa-de-verao/`).
2. Preencha os campos do torneio e de cada jogador (detalhes abaixo).
3. Salve, faça commit e dê push para a branch `master`.
4. O GitHub Actions builda e publica o site automaticamente. O torneio
   aparece na home assim que o deploy terminar (alguns minutos).

Arquivos que começam com `_` (como `_template.yml`) são **ignorados** pelo
site — é seguro deixar o template na pasta como referência.

## Campos do torneio

```yaml
name: "Copa de Verão VGC"
date: 2026-01-15          # formato AAAA-MM-DD, sem aspas
format: "VGC Reg I"        # opcional — pode remover a linha inteira
prize: "R$500 em produtos" # opcional — pode remover a linha inteira
players:
  - ...
```

- `name` e `date` são **obrigatórios**.
- `format` e `prize` são opcionais — se não usar, apague a linha inteira
  (não deixe em branco).

## Campos de cada jogador

```yaml
players:
  - rank: 1
    nick: "Nome do Jogador"
    pokepaste: "https://pokepast.es/xxxxxxxxxxxx"
    wins: 6
    losses: 1
    ties: 0
    points: 18
    team: |
      ...
```

| Campo | Obrigatório? | O que é |
|---|---|---|
| `rank` | sim | posição final do jogador no torneio (1 = campeão) |
| `nick` | sim | nome/nick do jogador, como deve aparecer no site |
| `pokepaste` | não | link do Pokepaste original, só para crédito — **não é usado para montar o time exibido no site**, é puramente um link de referência |
| `wins`, `losses`, `ties` | sim | vitórias, derrotas e empates |
| `points` | sim | pontuação final do jogador |
| `team` | sim | o time completo, no formato de exportação do Showdown/Pokepaste (explicado abaixo) |

Uma lista com pelo menos um jogador é obrigatória — um torneio sem
`players` não é válido.

## O campo `team`: colando o time

O `team` é o texto que você copia direto do Pokepaste (ou do "Export" do
Showdown) e cola no YAML, sem editar nada. Um time completo tem 6
Pokémon: cole os 6 blocos, **cada um separado por uma linha em branco**,
todos sob a mesma chave `team: |`, mantendo a indentação igual à dos
exemplos abaixo.

```yaml
    team: |
      Incineroar @ Sitrus Berry
      Ability: Intimidate
      Level: 50
      EVs: 244 HP / 12 Atk / 12 Def / 188 SpD / 52 Spe
      Careful Nature
      - Flare Blitz
      - Throat Chop
      - Parting Shot
      - Fake Out

      Salamence @ Salamencite
      Ability: Intimidate
      Level: 50
      EVs: 16 HP / 252 Atk / 252 Spe
      Jolly Nature
      - Slash
      - Dragon Claw
      - Tailwind
      - Protect

      (... mais 4 Pokémon, cada um separado por uma linha em branco)
```

Veja `data/tournaments/_template.yml` para um exemplo completo com os 6
Pokémon prontos — o jeito mais fácil de começar é copiar esse arquivo.

### O que o site consegue ler de cada Pokémon

| Linha no texto | O que vira no site |
|---|---|
| `Species @ Item` (primeira linha do bloco) | espécie e item segurado |
| `Nickname (Species) @ Item` | apelido + espécie, separados (ex: "Chompy (Garchomp)") |
| `Species (M)` ou `Species (F)` | tratado como marcador de gênero, **não** como apelido |
| `Ability: ...` | habilidade |
| `Level: ...` | nível |
| `Tera Type: ...` | tipo de Terastalização (aparece na modal do time, se presente) |
| `EVs: ...` | distribuição de EVs (ex: `244 HP / 12 Atk / ...`) |
| `IVs: ...` | distribuição de IVs |
| `<Nature> Nature` | natureza |
| `- Nome do Move` (até 4 linhas) | os moves do Pokémon |

Qualquer linha fora desse formato é simplesmente ignorada — não precisa
remover "Shiny: Yes" ou outras linhas que o Pokepaste às vezes inclui,
elas só não aparecem no site.

### Se um bloco de Pokémon ficar sem a linha de espécie

Se um dos 6 blocos estiver malformado a ponto de não dar pra identificar a
espécie (por exemplo, a primeira linha do bloco virou uma linha de
`Ability:` por engano, sem a linha `Species @ Item` antes dela), aquele
bloco é **pulado silenciosamente** — o time é publicado só com os
Pokémon que deram certo, sem quebrar o site inteiro. Se um time aparecer
com menos de 6 Pokémon no site, é sinal de que algum bloco ficou
malformado — confira se todos os 6 blocos começam com a linha
`Species @ Item` (ou só `Species`, sem item).

## Se algum campo obrigatório estiver errado

Diferente do problema acima (que só afeta o Pokémon malformado), um erro
nos campos do torneio ou do jogador — como esquecer `date`, deixar
`players` vazio, ou colocar um link inválido em `pokepaste` — **quebra o
build inteiro**: o deploy falha e nenhuma mudança é publicada até o
arquivo ser corrigido (isso vale pra qualquer torneio no site, não só o
que tem o erro). Se o deploy falhar no GitHub Actions, abra os logs da
Action — a mensagem de erro aponta o nome do arquivo `.yml` com problema.

## Sprites dos Pokémon

As imagens dos Pokémon são carregadas a partir do repositório público
[PokeAPI/sprites](https://github.com/PokeAPI/sprites), casando o nome da
espécie escrito no `team` com uma tabela interna do site. Formas
alternativas bem incomuns (megas raras, formas regionais menos usadas)
podem não ter uma correspondência exata — nesse caso, o sprite
simplesmente não aparece (sem quebrar a página), mas o nome da espécie
continua sendo mostrado normalmente.

## Testando antes de publicar

Se quiser conferir como o torneio vai ficar antes de dar push:

```bash
npm install
npm run dev
```

Isso sobe o site localmente com hot-reload, pra você revisar o torneio
antes de publicar de verdade.
