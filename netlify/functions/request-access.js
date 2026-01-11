export default async (req, context) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { email, form } = await req.json();

    const SHOP = process.env.SHOPIFY_DOMAIN;
    const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

    if (!SHOP || !ADMIN_TOKEN) {
      throw new Error("Missing Shopify env vars");
    }

    // 1️⃣ Find customer by email
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
                    node {
                      id
                    }
                  }
                }
              }
            `,
        }),
      }
    );

    const searchJson = await searchRes.json();
    const customerId = searchJson?.data?.customers?.edges?.[0]?.node?.id;

    if (!customerId) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
      });
    }

    // 2️⃣ Update customer note
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
          "X-Shopify-Access-Token": ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: `
              mutation customerUpdate($id: ID!, $input: CustomerInput!) {
                customerUpdate(id: $id, input: $input) {
                  customer { id }
                  userErrors { message }
                }
              }
            `,
          variables: {
            id: customerId,
            input: {
              note,
              tags: ["access_requested"],
            },
          },
        }),
      }
    );

    const updateJson = await updateRes.json();

    if (updateJson?.data?.customerUpdate?.userErrors?.length) {
      throw new Error(updateJson.data.customerUpdate.userErrors[0].message);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
