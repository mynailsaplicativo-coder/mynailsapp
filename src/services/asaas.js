/**
 * Serviço de Integração Asaas (Pré-moldado)
 */

const ASAAS_BASE_URL = 'https://api.asaas.com/v3';
// Utilizamos a chave fornecida na variável de ambiente
const API_KEY = import.meta.env.VITE_ASAAS_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'access_token': API_KEY || '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjUwYzgxNTQwLTYzMmQtNDEyYS05OWJjLTA1OTZkOTlhMzhjYTo6JGFhY2hfN2U3NjE3OTMtOWNjOC00NzA2LTgyOWEtZWZmZWI2Njk1NmMw'
};

/**
 * Gera um link genérico de pagamento (Checkout Asaas)
 * Ideal para testes no frontend sem precisar capturar CPF e Endereço.
 */
export const createPaymentLink = async () => {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/paymentLinks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        billingType: 'UNDEFINED',
        chargeType: 'DETACHED',
        name: 'Plano Premium - My Nails',
        description: 'Liberação de todos os recursos premium do aplicativo',
        value: 49.90,
        dueDateLimitDays: 3
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Asaas: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url; // Retorna a URL de checkout (ex: https://www.asaas.com/c/123456)
  } catch (error) {
    console.error('Falha ao gerar link de pagamento:', error);
    throw error;
  }
};
