const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);

  const response = await fetch('https://us6.api.mailchimp.com/3.0/lists/a6c1980457/members', {
    method: 'POST',
    headers: {
      Authorization: 'apikey 4dca48b7b1177739416b4d959e88686a-us6',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed'
    })
  });

  if (response.status >= 400) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email could not be added to Mailchimp.' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
