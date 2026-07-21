export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { clientName, clientEmail, value, description } = req.body;
  const asaasApiKey = process.env.VITE_ASAAS_API_KEY || process.env.ASAAS_API_KEY || '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjUwYzgxNTQwLTYzMmQtNDEyYS05OWJjLTA1OTZkOTlhMzhjYTo6JGFhY2hfN2U3NjE3OTMtOWNjOC00NzA2LTgyOWEtZWZmZWI2Njk1NmMw';

  if (!asaasApiKey) {
    return res.status(500).json({ error: 'ASAAS_API_KEY is not configured.' });
  }

  try {
    // 1. Criar ou buscar o Customer (Manicure pagando a Plataforma)
    let customerId = '';
    
    // Busca se já existe um customer com esse email no Asaas
    const searchRes = await fetch(`https://api.asaas.com/v3/customers?email=${clientEmail}`, {
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json'
      }
    });
    
    const searchData = await searchRes.json();
    if (searchData.data && searchData.data.length > 0) {
      customerId = searchData.data[0].id;
    } else {
      // Cria um novo customer se não existir
      const createCustomerRes = await fetch('https://api.asaas.com/v3/customers', {
        method: 'POST',
        headers: {
          'access_token': asaasApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail
        })
      });
      
      const newCustomer = await createCustomerRes.json();
      if (newCustomer.errors) {
        return res.status(400).json(newCustomer);
      }
      customerId = newCustomer.id;
    }

    // 2. Criar a Assinatura (Subscription)
    const subscriptionPayload = {
      customer: customerId,
      billingType: 'PIX', // Pode ser BOLETO, CREDIT_CARD ou PIX
      nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Começa a cobrar amanhã (ou hoje se preferir)
      value: value,
      cycle: 'MONTHLY',
      description: description
    };

    const response = await fetch('https://api.asaas.com/v3/subscriptions', {
      method: 'POST',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscriptionPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // O Asaas não retorna a invoiceUrl diretamente na Subscription,
    // Mas retorna o ID que pode ser usado. Dependendo da configuração, o Asaas envia o email direto.
    // Vamos tentar buscar a fatura que foi gerada para essa assinatura
    let invoiceUrl = '';
    const paymentsRes = await fetch(`https://api.asaas.com/v3/payments?subscription=${data.id}`, {
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json'
      }
    });
    const paymentsData = await paymentsRes.json();
    if (paymentsData.data && paymentsData.data.length > 0) {
        invoiceUrl = paymentsData.data[0].invoiceUrl;
    }

    return res.status(200).json({ 
      subscriptionId: data.id,
      invoiceUrl: invoiceUrl || `https://api.asaas.com/c/${customerId}`
    });

  } catch (error) {
    console.error('Erro na integração com Asaas (Subscription):', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
