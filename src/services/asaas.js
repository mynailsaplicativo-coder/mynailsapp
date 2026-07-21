/**
 * Serviço de Integração Asaas (Pré-moldado)
 */

const ASAAS_BASE_URL = 'https://api.asaas.com/v3';
const API_KEY = import.meta.env.VITE_ASAAS_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'access_token': API_KEY || '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjUwYzgxNTQwLTYzMmQtNDEyYS05OWJjLTA1OTZkOTlhMzhjYTo6JGFhY2hfN2U3NjE3OTMtOWNjOC00NzA2LTgyOWEtZWZmZWI2Njk1NmMw'
};

/**
 * Gera um link genérico de pagamento (Checkout Asaas)
 * Atualizado para aceitar Planos Mensais e Valores dinâmicos.
 */
export const createPaymentLink = async (planName, value) => {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/paymentLinks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        billingType: 'UNDEFINED',
        chargeType: 'RECURRING', // Transforma em Assinatura (se a conta Asaas permitir no link genérico)
        name: `Plano ${planName} - My Nails`,
        description: `Assinatura mensal do Plano ${planName}`,
        value: value,
        dueDateLimitDays: 3,
        endDate: '2099-12-31', // Mantém a recorrência ativa indefinidamente
        cycle: 'MONTHLY'
      })
    });

    // Fallback: se o Asaas recusar chargeType RECURRING em paymentLinks para essa conta, 
    // ele deve ser testado, mas na documentação v3 é permitido.
    
    if (!response.ok) {
      const errData = await response.json().catch(()=>({}));
      console.warn("Aviso Asaas:", errData);
      
      // Tenta fallback sem RECURRING caso a conta não tenha permissão de assinaturas genéricas
      const fallbackResponse = await fetch(`${ASAAS_BASE_URL}/paymentLinks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          billingType: 'UNDEFINED',
          chargeType: 'DETACHED',
          name: `Plano ${planName} - My Nails (Pagamento Único Fallback)`,
          description: `Assinatura do Plano ${planName}`,
          value: value,
          dueDateLimitDays: 3
        })
      });
      if (!fallbackResponse.ok) throw new Error(`Erro na API do Asaas (Fallback): ${fallbackResponse.statusText}`);
      
      const fbData = await fallbackResponse.json();
      return fbData.url;
    }

    const data = await response.json();
    return data.url; 
  } catch (error) {
    console.error('Falha ao gerar link de pagamento:', error);
    throw error;
  }
};
