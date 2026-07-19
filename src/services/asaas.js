/**
 * Serviço de Integração Asaas (Pré-moldado)
 * 
 * ATENÇÃO: Devido a políticas de segurança (CORS) e proteção da chave da API,
 * chamadas diretas do frontend (React) para o Asaas geralmente são bloqueadas.
 * O ideal é que estas funções sejam movidas para o seu Backend (Node.js, Firebase Functions, etc) no futuro.
 * 
 * Por enquanto, deixamos a estrutura montada para facilitar a transição!
 */

const ASAAS_BASE_URL = 'https://api.asaas.com/v3';
// No Vite, as variáveis de ambiente com VITE_ ficam acessíveis via import.meta.env
const API_KEY = import.meta.env.VITE_ASAAS_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'access_token': API_KEY
};

/**
 * Cria um novo cliente no Asaas
 * @param {Object} clientData - Dados do cliente { name, cpfCnpj, email, phone }
 */
export const createCustomer = async (clientData) => {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(clientData)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao criar cliente: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na API Asaas (createCustomer):', error);
    throw error;
  }
};

/**
 * Gera uma cobrança avulsa (ex: pagamento de um serviço de unha pelo app)
 * @param {Object} paymentData - Dados do pagamento { customer, billingType, value, dueDate, description }
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...paymentData,
        billingType: 'PIX', // Forçando PIX como padrão para o app
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar pagamento: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na API Asaas (createPayment):', error);
    throw error;
  }
};

/**
 * Cria uma assinatura (ex: Plano Premium para Profissionais)
 * @param {Object} subscriptionData - { customer, billingType, value, nextDueDate, cycle, description }
 */
export const createSubscription = async (subscriptionData) => {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...subscriptionData,
        cycle: 'MONTHLY',
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar assinatura: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na API Asaas (createSubscription):', error);
    throw error;
  }
};
