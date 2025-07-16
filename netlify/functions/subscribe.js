exports.handler = async (event) => {
  const { email, gdpr } = JSON.parse(event.body);

  const API_KEY = '731f67a59f4e5cd1049a07129d0faef9-us6';
  const LIST_ID = 'a6c1980457';
  const DATACENTER = 'us6';

  try {
    const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        marketing_permissions: [
          {
            marketing_permission_id: '77973',
            enabled: gdpr
          }
        ]
      })
    });

    const data = await response.json();

    if (response.status >= 400) {
      console.log('Mailchimp response:', data);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.detail || 'Unknown error' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
