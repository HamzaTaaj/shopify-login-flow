// import fetch from "node-fetch";

// const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN!;
// const SHOP = process.env.SHOPIFY_DOMAIN!;

// export default async function handler(req: any, res: any) {
//   const { email, form } = JSON.parse(req.body);

//   const note = `
// REQUEST ACCESS FORM
// -------------------
// Company: ${form.company}
// Location: ${form.location}
// Machines: ${form.machines}
// Role: ${form.role}
// Message:
// ${form.message}
// `;

//   const query = `
//     mutation customerUpdate($id: ID!, $input: CustomerInput!) {
//       customerUpdate(id: $id, input: $input) {
//         customer {
//           id
//         }
//         userErrors {
//           message
//         }
//       }
//     }
//   `;

//   // 🔎 Step 1: find customer by email
//   const searchRes = await fetch(
//     \`https://${SHOP}/admin/api/2024-01/graphql.json\`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Access-Token": ADMIN_TOKEN,
//       },
//       body: JSON.stringify({
//         query: `
//           query {
//             customers(first: 1, query: "email:${email}") {
//               edges {
//                 node {
//                   id
//                 }
//               }
//             }
//           }
//         `,
//       }),
//     }
//   );

//   const searchJson = await searchRes.json();
//   const customerId = searchJson.data.customers.edges[0].node.id;

//   // ✏️ Step 2: update notes
//   const updateRes = await fetch(
//     \`https://${SHOP}/admin/api/2024-01/graphql.json\`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Access-Token": ADMIN_TOKEN,
//       },
//       body: JSON.stringify({
//         query,
//         variables: {
//           id: customerId,
//           input: {
//             note,
//           },
//         },
//       }),
//     }
//   );

//   const updateJson = await updateRes.json();
//   res.status(200).json(updateJson);
// }
