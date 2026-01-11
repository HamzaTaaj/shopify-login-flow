import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { email, form } = JSON.parse(event.body);

    const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
    const SHOP = process.env.SHOPIFY_DOMAIN;

    if (!ADMIN_TOKEN || !SHOP) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing env variables" }),
      };
    }

    const note = `
REQUEST ACCESS FORM
-------------------
Company: ${form.company}
Location: ${form.location}
Machines: ${form.machines}
Role: ${form.role}
Message:
${form.message}
`;

    // 🔍 Find customer by email
    const searchRes = await fetch(
      `https://${SHOP}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query {
              customers(first: 1, query: "email:${email}") {
                edges {
                  node { id }
                }
              }
            }
          `,
        }),
      }
    );

    const searchJson = await searchRes.json();
    const customerId = searchJson.data.customers.edges[0]?.node.id;

    if (!customerId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Customer not found" }),
      };
    }

    // ✏️ Update customer note
    await fetch(`https://${SHOP}/admin/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query: `
            mutation {
              customerUpdate(
                id: "${customerId}",
                input: { note: ${JSON.stringify(note)} }
              ) {
                customer { id }
              }
            }
          `,
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}
