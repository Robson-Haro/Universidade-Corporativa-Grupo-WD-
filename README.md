# Universidade Corporativa Grupo WD

Plataforma da **Jornada do Conhecimento** do Grupo WD.

## Jornada inicial
- Jornada de Liderança
  - Módulo 1 — Se conhecendo para liderar
  - Módulo 2 — Comunicação e Excelência
  - Avaliações
  - Certificação

O conteúdo dos dois módulos é integrado ao TreinamentoWD1 publicado, enquanto progresso, avaliações e certificados pertencem à Universidade Corporativa.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Backend persistente
Execute `supabase-universidade.sql` em um projeto Supabase e configure:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Sem essas variáveis, a experiência continua funcional no navegador usando armazenamento local.
