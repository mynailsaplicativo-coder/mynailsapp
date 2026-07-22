export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { clientName, clientEmail, value, description, splitWalletId } = req.body;
  const API_KEY = process.env.VITE_ASAAS_API_KEY || 'dummy_key_redeploy';

  try {
    // 1. Procurar ou Criar Customer (Cliente Genérico para o Agendamento)
    // Para simplificar no protótipo, vamos criar um customer sempre
    const customerRes = await fetch('https://api.asaas.com/v3/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': API_KEY
      },
      body: JSON.stringify({
        name: clientName || 'Cliente Genérico',
        email: clientEmail || 'cliente@mynails.app.br',
        cpfCnpj: '00000000000' // Opcional, mas Asaas pode exigir dependendo da configuração. Se falhar, tentamos sem.
      })
    });
    
    let customerId;
    if (customerRes.ok) {
      const customerData = await customerRes.json();
      customerId = customerData.id;
    } else {
      // Tenta criar sem CPF
      const fallbackCustomer = await fetch('https://api.asaas.com/v3/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'access_token': API_KEY },
        body: JSON.stringify({ name: clientName || 'Cliente Genérico' })
      });
      const customerData = await fallbackCustomer.json();
      customerId = customerData.id;
    }

    if (!customerId) {
      throw new Error("Não foi possível criar o cliente no Asaas.");
    }

    // 2. Criar a Cobrança (Payment) com Split
    const paymentPayload = {
      customer: customerId,
      billingType: 'UNDEFINED', // Deixa o cliente escolher (PIX, Cartão, Boleto)
      value: value,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 dias
      description: description || 'Serviço My Nails'
    };

    // Se a manicure conectou a conta dela, adiciona a regra de Split de 100% (menos taxas do Asaas)
    if (splitWalletId) {
      paymentPayload.split = [
        {
          walletId: splitWalletId,
          percentualValue: 100 // Repassa 100% para a manicure. A taxa fixa do Asaas já é descontada.
        }
      ];
    }

    const paymentRes = await fetch('https://api.asaas.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': API_KEY
      },
      body: JSON.stringify(paymentPayload)
    });

    const paymentData = await paymentRes.json();
    
    if (!paymentRes.ok) {
      return res.status(400).json(paymentData);
    }

    // Retorna a URL de pagamento (invoiceUrl)
    return res.status(200).json(paymentData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
