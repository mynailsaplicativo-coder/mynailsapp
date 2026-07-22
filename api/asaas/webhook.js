export default async function handler(req, res) {
  // O Asaas sempre envia webhooks usando POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const event = req.body;
    console.log('Webhook Asaas recebido:', event);

    // Aqui no futuro você pode validar o event.event e atualizar o banco de dados (ex: PAYMENT_RECEIVED libera o plano VIP)
    // if (event.event === 'PAYMENT_RECEIVED') { ... }

    // O Asaas exige que o Webhook retorne status 200 OK
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.status(500).json({ error: 'Erro interno no webhook' });
  }
}
