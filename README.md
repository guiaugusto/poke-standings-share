# poke-standings-share

Boilerplate para lojas de cartas hospedarem os resultados finais dos seus
torneios de Pokémon VGC como um site estático no GitHub Pages — sem
backend, sem banco de dados.

## Como usar

1. Clique em **"Use this template"** neste repositório para criar o seu
   próprio repositório.
2. No seu novo repositório, vá em **Settings → Pages** e configure a fonte
   como **GitHub Actions**.
3. Para publicar um torneio nome:
   - Copie `data/tournaments/_template.yml` para um novo arquivo na mesma
     pasta (ex: `data/tournaments/copa-de-verao.yml`).
   - Preencha os campos do torneio e de cada jogador, colando o texto do
     time (exportado do Pokepaste ou do Showdown) no campo `team`.
   - Faça commit e push para a branch `master`.
4. O GitHub Actions builda e publica o site automaticamente. O novo
   torneio aparece na home assim que o deploy terminar.

## Desenvolvimento local

```bash
npm install
npm run dev       # site local com hot-reload
npm test          # testes unitários
npm run test:build # build de produção + smoke test
```
