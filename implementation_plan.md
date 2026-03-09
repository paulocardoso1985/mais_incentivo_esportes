# Plano de Implementação - Novas Regras Mais Incentivo Esportes

Ajustes na plataforma para suportar regionalização, logística de voos, automação de e-mails e engajamento de vendas.

## Alterações Propostas

### 1. Database & Prisma
- Atualizar `schema.prisma` com:
    - `User`: `region`, `city`, `favoriteTeam`.
    - `EventPackage`: `region`, `city`, `departureAirport`, `flightsInfo`, `connectionNotice`, `additionalFlightCost`, `catalogPdfUrl`.
    - `User` (Sell-in): Campos para vincular carteira de CNPJs.

### 2. API (Backend)
- **AuthService/UsersService**: Atualizar fluxos de cadastro para novos campos.
- **EventsService**: Implementar filtros de regionalização nas queries de listagem.
- **EmailService (Novo)**: Criar serviço para disparos automáticos via SMTP ou API de terceiros.

### 3. Web (Frontend)
- **CMS (Admin)**: 
    - Atualizar formulário de pacotes com campos de localidade, logística e upload de PDF.
- **Dashboards**:
    - Implementar componente de "Meta de Resgate" (barra de progresso).
    - Criar área de "Sugestões de Promoção" para impulsionar saldo.
- **Catálogo**:
    - Adicionar selos de localidade e aeroporto nos cards.
    - Implementar lógica de filtragem automática baseada no perfil do usuário.

### 4. Emails
- Templates de: Recebimento de NF, Aprovação de Vínculo, Confirmação de Resgate (User/Admin).

## Plano de Verificação

### Testes
- Validar se um usuário de "Belém" visualiza apenas jogos regionais e eventos nacionais.
- Testar o fluxo de resgate e verificar o recebimento (log) do e-mail de notificação.
- Confirmar se o "Falta pouco" calcula corretamente a diferença para o próximo pacote.
