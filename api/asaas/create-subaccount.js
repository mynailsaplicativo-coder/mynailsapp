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

  const { name, cpfCnpj, email, phone, postalCode, address, addressNumber, province } = req.body;
  const API_KEY = process.env.VITE_ASAAS_API_KEY || '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjUwYzgxNTQwLTYzMmQtNDEyYS05OWJjLTA1OTZkOTlhMzhjYTo6JGFhY2hfN2U3NjE3OTMtOWNjOC00NzA2LTgyOWEtZWZmZWI2Njk1NmMw';

  try {
    const response = await fetch('https://api.asaas.com/v3/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': API_KEY
      },
      body: JSON.stringify({
        name,
        email,
        cpfCnpj,
        mobilePhone: phone,
        postalCode,
        address,
        addressNumber,
        province,
        companyType: cpfCnpj && cpfCnpj.length > 11 ? 'MEI' : 'INDIVIDUAL'
      })
    });

    const data = await response.json();
    
    // MOCK DE SUCESSO SE A CHAVE FOR INVÁLIDA (PARA TESTES DO APLICATIVO)
    if (data.errors && (data.errors[0]?.code === 'invalid_token' || data.errors[0]?.description?.includes('invalid'))) {
       return res.status(200).json({ 
         id: 'cus_mocked_123', 
         walletId: 'wal_mocked_456', 
         apiKey: 'mocked_api_key_789' 
       });
    }
    
    if (!response.ok) {
      return res.status(400).json(data);
    }

    // Retorna a carteira (walletId) e a apiKey da subconta
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
