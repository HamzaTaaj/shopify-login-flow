import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const SHOP = process.env.SHOPIFY_DOMAIN;

if (!ADMIN_TOKEN || !SHOP) {
  console.error("❌ Missing SHOPIFY_ADMIN_TOKEN or SHOPIFY_DOMAIN");
  process.exit(1);
}

app.post("/request-access", async (req, res) => {
  const { email, form } = req.body;

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

  try {
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
      return res.status(404).json({ error: "Customer not found" });
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
                userErrors { message }
              }
            }
          `,
      }),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(4000, () => {
  console.log("✅ Server running on http://localhost:4000");
});
