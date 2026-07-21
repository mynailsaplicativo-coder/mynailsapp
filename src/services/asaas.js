/**
 * Serviço de Integração Asaas (Backend Vercel API)
 */

// Se estiver rodando local, aponta para localhost, senão aponta para a raiz (Vercel)
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';

/**
 * Cria uma Subconta no Asaas (Marketplace White Label)
 */
export const createSubaccount = async (accountData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asaas/create-subaccount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData)
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || err.description || 'Erro ao criar conta Asaas');
    }
    
    return await response.json(); // Retorna { walletId, apiKey, ... }
  } catch (error) {
    console.error('Falha ao criar subconta:', error);
    throw error;
  }
};

/**
 * Gera um link de pagamento. Se houver splitWalletId, envia 100% para a manicure.
 */
export const createSplitPayment = async ({ clientName, clientEmail, value, description, splitWalletId }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asaas/create-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName, clientEmail, value, description, splitWalletId })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || err.description || 'Erro ao gerar pagamento');
    }

    const data = await response.json();
    return data.invoiceUrl; // A URL final do Asaas para o cliente pagar
  } catch (error) {
    console.error('Falha ao gerar pagamento:', error);
    throw error;
  }
};

/**
 * Compatibilidade: Link genérico de Assinatura (Planos Profissionais)
 */
export const createPaymentLink = async (planName, value) => {
  // Vamos usar a mesma função de pagamento, mas enviando o dinheiro para a conta Principal da Plataforma (sem splitWalletId)
  return await createSplitPayment({
    clientName: 'Manicure Profissional',
    value: value,
    description: `Assinatura Plano ${planName}`
  });
};
