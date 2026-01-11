export default async function handler(req) {
  try {
    console.log("Function called");

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();
    console.log("Request body:", body);

    const email = body.email;
    const form = body.form;

    const SHOP = process.env.SHOPIFY_DOMAIN;
    const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

    console.log("Env check:", { SHOP, TOKEN });

    if (!SHOP || !TOKEN) {
      throw new Error("Missing Shopify env variables");
    }

    // 🔍 customer search
    const searchRes = await fetch(
      `https://${SHOP}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": TOKEN,
        },
        body: JSON.stringify({
          query: `
              {
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
    console.log("Search response:", searchJson);

    const customerId = searchJson?.data?.customers?.edges?.[0]?.node?.id;

    if (!customerId) {
      throw new Error("Customer not found in Shopify");
    }

    const note = `
  REQUEST ACCESS FORM
  Company: ${form.company}
  Location: ${form.location}
  Machines: ${form.machines}
  Role: ${form.role}
  Message:
  ${form.message}
  `;

    const updateRes = await fetch(
      `https://${SHOP}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": TOKEN,
        },
        body: JSON.stringify({
          query: `
              mutation {
                customerUpdate(
                  input: {
                    id: "${customerId}"
                    note: """${note}"""
                    tags: ["access_requested"]
                  }
                ) {
                  customer { id }
                  userErrors { message }
                }
              }
            `,
        }),
      }
    );

    const updateJson = await updateRes.json();
    console.log("Update response:", updateJson);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("Function error:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
