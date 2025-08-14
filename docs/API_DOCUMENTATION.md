# Documentação da API

Esta documentação descreve os endpoints da API disponíveis no aplicativo financeiro.

## Autenticação

A autenticação é feita via JWT (JSON Web Token). Inclua o token no cabeçalho das requisições:

```
Authorization: Bearer <seu_token_aqui>
```

## Endpoints

### 1. Cartões de Crédito

#### Listar Cartões
```
GET /api/credit-cards
```

**Resposta de Sucesso (200):**
```json
{
  "cards": [
    {
      "id": 1,
      "userId": 1,
      "name": "Cartão Nubank",
      "brand": "mastercard",
      "type": "credito",
      "lastFourDigits": "1234",
      "creditLimit": 5000.00,
      "currentBalance": 1320.45,
      "availableLimit": 3679.55,
      "closingDay": 5,
      "dueDay": 15,
      "color": "#8A05BE",
      "isFavorite": true,
      "isActive": true,
      "notes": "Cartão principal",
      "createdAt": "2025-08-14T13:00:00.000Z",
      "updatedAt": "2025-08-14T13:00:00.000Z"
    }
  ]
}
```

#### Criar Cartão
```
POST /api/credit-cards
```

**Corpo da Requisição:**
```json
{
  "name": "Novo Cartão",
  "brand": "visa",
  "type": "credito",
  "lastFourDigits": "5678",
  "creditLimit": 3000.00,
  "closingDay": 10,
  "dueDay": 20,
  "color": "#3B82F6",
  "notes": "Cartão secundário"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 2,
  "userId": 1,
  "name": "Novo Cartão",
  "brand": "visa",
  "type": "credito",
  "lastFourDigits": "5678",
  "creditLimit": 3000.00,
  "currentBalance": 0.00,
  "availableLimit": 3000.00,
  "closingDay": 10,
  "dueDay": 20,
  "color": "#3B82F6",
  "isFavorite": false,
  "isActive": true,
  "notes": "Cartão secundário",
  "createdAt": "2025-08-14T13:30:00.000Z",
  "updatedAt": "2025-08-14T13:30:00.000Z"
}
```

### 2. Categorias

#### Listar Categorias
```
GET /api/categories
```

**Resposta de Sucesso (200):**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Alimentação",
      "color": "#10B981",
      "icon": "utensils",
      "isIncome": false,
      "createdAt": "2025-08-14T13:00:00.000Z",
      "updatedAt": "2025-08-14T13:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Salário",
      "color": "#3B82F6",
      "icon": "dollar-sign",
      "isIncome": true,
      "createdAt": "2025-08-14T13:00:00.000Z",
      "updatedAt": "2025-08-14T13:00:00.000Z"
    }
  ]
}
```

## Estrutura do Banco de Dados

### Tabela: credit_cards
| Coluna | Tipo | Descrição |
|--------|------|-------------|
| id | integer | Chave primária |
| userId | integer | ID do usuário dono do cartão |
| name | string | Nome do cartão |
| brand | enum('visa', 'mastercard', 'elo', 'hipercard', 'amex') | Bandeira do cartão |
| type | enum('credito', 'debito', 'multiplo') | Tipo do cartão |
| lastFourDigits | string | Últimos 4 dígitos do cartão |
| creditLimit | decimal | Limite total do cartão |
| currentBalance | decimal | Valor atual da fatura |
| availableLimit | decimal | Limite disponível |
| closingDay | integer | Dia de fechamento da fatura |
| dueDay | integer | Dia de vencimento da fatura |
| color | string | Cor do cartão em hexadecimal |
| isFavorite | boolean | Se o cartão é favorito |
| isActive | boolean | Se o cartão está ativo |
| notes | text | Observações sobre o cartão |
| createdAt | timestamp | Data de criação |
| updatedAt | timestamp | Data de atualização |

### Tabela: categories
| Coluna | Tipo | Descrição |
|--------|------|-------------|
| id | integer | Chave primária |
| name | string | Nome da categoria |
| color | string | Cor em hexadecimal |
| icon | string | Ícone da categoria |
| isIncome | boolean | Se é uma categoria de receita |
| createdAt | timestamp | Data de criação |
| updatedAt | timestamp | Data de atualização |

## Códigos de Status HTTP

| Código | Descrição |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Autenticação necessária |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

## Exemplos de Uso

### Listar Cartões
```javascript
const response = await fetch('/api/credit-cards', {
  headers: {
    'Authorization': 'Bearer seu_token_aqui'
  }
});
const data = await response.json();
console.log(data.cards);
```

### Criar Categoria
```javascript
const response = await fetch('/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer seu_token_aqui'
  },
  body: JSON.stringify({
    name: 'Lazer',
    color: '#F59E0B',
    icon: 'film',
    isIncome: false
  })
});

const data = await response.json();
console.log('Categoria criada:', data);
```

## Considerações Finais

- Todas as datas são retornadas no formato ISO 8601 (UTC).
- Valores monetários são sempre em centavos (ex: R$ 10,00 = 1000).
- Os endpoints seguem as melhores práticas RESTful.
- A API retorna respostas padronizadas em JSON.
