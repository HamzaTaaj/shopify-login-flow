export async function shopifyFetch(query: string) {
  const response = await fetch(
    "https:///pizzaanytime.myshopify.com/api/2024-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "c566bb809e97b88e377ef232b3986e23",
      },
      body: JSON.stringify({ query }),
    }
  );

  return response.json();
}
