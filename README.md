# Gabriel Paiva · Portfólio

Portfólio pessoal de **Gabriel Marinho Paiva**, estudante de ADS a caminho de Engenharia de Software.
Transformo ideias em protótipos funcionais com IA.

Site estático em uma página, feito com **HTML, CSS e JavaScript puros**. Não usa frameworks, bibliotecas nem etapa de build.

## Seções

- **Início**: apresentação.
- **Sobre mim**.
- **Trajetória**.
- **Case**: camada de inteligência para ERP.
- **Projetos**.
- **Serviços**.
- **Contato**: e-mail com botão de copiar.

## Destaques

- **Modo claro e escuro** pelo botão ◐. A escolha fica salva no navegador e é aplicada antes de a página aparecer, sem piscar.
- **Retícula radial (halftone)** desenhada em `<canvas>` com pontos em anéis concêntricos. Ela acompanha a cor do modo e se redesenha quando a tela muda de tamanho.
- **Identidade visual** em ciano com a fonte display *Planet Kosmos*.
- **Responsivo** a partir de 360px, com menu mobile.
- **Interações leves**:
  - Animação ao rolar, desligada para quem pede menos movimento no sistema.
  - Menu que destaca a seção visível.
  - Aviso "copiado ✓" ao copiar o e-mail.
- **Acessível**:
  - HTML semântico.
  - Atributos `aria-*` nos controles.
  - Navegação por teclado (Esc fecha o menu).

## Estrutura

```
├── index.html          # conteúdo e estrutura
├── style.css           # estilos, cores e modo claro/escuro
├── script.js           # modo, retícula, menu, animações e copiar e-mail
├── foto.webp
├── fontes/
│   └── Planet Kosmos.ttf
└── prints/
    └── print-5.webp    # print do case
```

## Rodando localmente

Basta abrir o `index.html` no navegador. Também dá para servir a pasta:

```bash
python -m http.server 5500
```

Depois acesse `http://localhost:5500`.

## Publicação

Funciona direto no **GitHub Pages**:

1. Abra **Settings → Pages**.
2. Escolha a branch `main` e a pasta `/ (root)`.
3. Salve.

## Personalizando a retícula

Cada `<canvas class="reticula">` no `index.html` aceita os atributos abaixo:

| Atributo   | O que faz                                          |
|------------|----------------------------------------------------|
| `data-cx`  | centro horizontal (fração da largura, ex.: `0.5`)  |
| `data-cy`  | centro vertical (fração da altura)                 |
| `data-r`   | raio (fração do maior lado)                        |
| `data-ang` | direção dos lóbulos de pontos grandes, em graus    |

---

© Gabriel Marinho Paiva. Todos os direitos reservados.
