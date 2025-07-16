exports.handler = async (event) => {
  const { email, gdpr } = JSON.parse(event.body);

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const DATACENTER = process.env.MAILCHIMP_DC;

  if (!API_KEY || !LIST_ID || !DATACENTER) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Mailchimp ENV variables.' })
    };
  }

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
            marketing_permission_id: 'a37b9ae8aa',
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
        body: JSON.stringify({ error: 'Error subscribing to newsletter.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.log('Fetch failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fetch to Mailchimp failed.' })
    };
  }
};
