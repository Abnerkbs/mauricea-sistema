# 🚛 Sistema Mauricea - Coleta de Sobras de Ração

Sistema completo para controle e rastreio de coletas de sobras de ração da **Mauricea Alimentos**.

![Version](https://img.shields.io/badge/version-1.0.0-red)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📅 **Dashboard com Calendário Interativo** - Visualização completa das coletas por data
- 📊 **Relatórios Diários e Mensais** - Análise detalhada com gráficos e tabelas
- 📄 **Exportação PDF** - Relatórios profissionais com design Mauricea
- 🗑️ **Sistema de Exclusão** - Remoção individual ou por dia completo
- 📱 **Interface 100% Responsiva** - Funciona perfeitamente em mobile e desktop
- 🎨 **Design Mauricea** - Paleta oficial (Vermelho, Laranja e Branco)
- ⚡ **Performance Otimizada** - Carregamento rápido e interface fluida
- 🔒 **Validações Inteligentes** - Prevenção de erros e dados inconsistentes

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/mauricea-sistema.git
cd mauricea-sistema

# Instale as dependências
npm install

# Execute o projeto
npm start
```

O sistema estará disponível em `http://localhost:3000`

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework JavaScript
- **Tailwind CSS** - Framework CSS para estilização
- **Lucide React** - Biblioteca de ícones moderna
- **JavaScript ES6+** - Linguagem de programação
- **HTML5 & CSS3** - Estrutura e estilização

## 📋 Funcionalidades Detalhadas

### 🗓️ Calendário de Coletas
- Seleção interativa de datas
- Cards informativos com totais do dia
- Lista de viagens com detalhes completos
- Sistema de exclusão rápida

### 📊 Sistema de Relatórios
- **Relatório Diário**: Análise completa de um dia específico
- **Relatório Mensal**: Visão consolidada do mês
- Gráficos visuais de peso por viagem
- Tabelas detalhadas com todos os dados

### 🚚 Cadastro de Viagens
- Horários de coleta e descarga separados
- Pesos com validação automática
- Granjas de origem e destino
- Tickets gerados automaticamente

### 📄 Exportação PDF
- Design profissional da Mauricea
- Dados organizados em tabelas
- Informações de cabeçalho e rodapé
- Auto-impressão facilitada

## 📱 Screenshots

```
[Calendário]          [Relatório Diário]     [Modal Nova Viagem]
     📅                      📊                      ➕
  Cards com               Gráficos               Formulário
  totais do dia          e tabelas              completo
```

## 🎨 Design System

### Paleta de Cores
- **Vermelho Principal**: `#dc2626`
- **Laranja Secundário**: `#ea580c` 
- **Branco**: `#ffffff`
- **Cinzas**: Tons variados para texto e elementos

### Componentes
- Cards com gradientes
- Botões com hover effects
- Modals responsivos
- Tabelas organizadas
- Estados vazios informativos

## 📦 Estrutura do Projeto

```
mauricea-sistema/
├── public/
├── src/
│   ├── App.js          # Componente principal
│   ├── App.css         # Estilos customizados
│   ├── index.js        # Ponto de entrada
│   └── index.css       # Estilos globais (Tailwind)
├── package.json        # Dependências
├── tailwind.config.js  # Configuração Tailwind
└── README.md          # Este arquivo
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload da pasta build/ no netlify.com
```

### GitHub Pages
```bash
npm install --save-dev gh-pages

# Adicionar no package.json:
"homepage": "https://SEU_USUARIO.github.io/mauricea-sistema",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

npm run deploy
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Add: nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📈 Próximas Features

- [ ] Sistema de autenticação
- [ ] Backup automático dos dados
- [ ] Integração com APIs externas
- [ ] Notificações push
- [ ] Modo offline
- [ ] Dashboard analytics avançado

## 🐛 Bugs Conhecidos

Nenhum bug crítico identificado. Para reportar bugs, abra uma [issue](https://github.com/SEU_USUARIO/mauricea-sistema/issues).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvedor Principal**: [Seu Nome]
- **Cliente**: Mauricea Alimentos
- **Design**: Sistema próprio baseado na identidade visual Mauricea

---

<div align="center">
  <strong>Feito com ❤️ para Mauricea Alimentos</strong>
</div>
