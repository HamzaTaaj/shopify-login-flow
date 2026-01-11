// ================= ENV =================
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
  throw new Error("Shopify env variables missing");
}

const endpoint = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

// ================= REGISTER (REQUEST ACCESS) =================
export async function shopifyRegisterWithNotes(form: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  location?: string;
  machines?: string;
  role?: string;
  message?: string;
}) {
  const note = `
REQUEST ACCESS FORM

Company: ${form.company}
Location: ${form.location || "-"}
Machines: ${form.machines || "-"}
Role: ${form.role || "-"}
Message:
${form.message || "-"}
`;

  // 🔐 strong random password (Shopify safe)
  const tempPassword = "Temp@" + Math.random().toString(36).slice(-10) + "A1";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: `
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
            }
            customerUserErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: tempPassword,
          note,
          tags: ["request-access"],
        },
      },
    }),
  });

  const json = await res.json();

  const errors = json?.data?.customerCreate?.customerUserErrors;

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return true;
}
// ================= LOGIN =================
export async function shopifyLogin(email: string, password: string) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: `
          mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
              customerAccessToken {
                accessToken
                expiresAt
              }
              customerUserErrors {
                message
              }
            }
          }
        `,
      variables: {
        input: { email, password },
      },
    }),
  });

  const json = await res.json();
  const data = json?.data?.customerAccessTokenCreate;

  if (data?.customerUserErrors?.length) {
    throw new Error(data.customerUserErrors[0].message);
  }

  return data.customerAccessToken;
}

// ================= SIGNUP =================
export async function shopifySignup(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: `
          mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer {
                id
              }
              customerUserErrors {
                field
                message
              }
            }
          }
        `,
      variables: {
        input: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: input.password,
        },
      },
    }),
  });

  const json = await res.json();

  const errors = json?.data?.customerCreate?.customerUserErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return true;
}
// ================= UPDATE CUSTOMER NOTES =================
export async function shopifyUpdateCustomerNotes(
  token: string,
  data: {
    company: string;
    location?: string;
    machines?: string;
    role?: string;
    message?: string;
  }
) {
  const note = `
  REQUEST ACCESS FORM
  -------------------
  Company: ${data.company}
  Location: ${data.location || "-"}
  Machines: ${data.machines || "-"}
  Role: ${data.role || "-"}
  Message:
  ${data.message || "-"}
  `;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: `
          mutation customerUpdate($token: String!, $customer: CustomerUpdateInput!) {
            customerUpdate(customerAccessToken: $token, customer: $customer) {
              customer {
                id
              }
              customerUserErrors {
                message
              }
            }
          }
        `,
      variables: {
        token,
        customer: {
          note,
        },
      },
    }),
  });

  const json = await res.json();
  console.log("customerUpdate response:", json);

  const errors = json?.data?.customerUpdate?.customerUserErrors;

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return true;
}

// ================= REGISTER =================
export async function shopifyRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: `
          mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer {
                id
              }
              customerUserErrors {
                message
              }
            }
          }
        `,
      variables: {
        input: {
          firstName,
          lastName,
          email,
          password,
        },
      },
    }),
  });

  const json = await res.json();
  const data = json.data.customerCreate;

  if (data.customerUserErrors.length) {
    throw new Error(data.customerUserErrors[0].message);
  }

  return data.customer;
}

// ================= CUSTOMER DASHBOARD =================
export async function fetchCustomerDashboard(token: string) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: `
          query getCustomer($token: String!) {
            customer(customerAccessToken: $token) {
              firstName
              lastName
              email
              orders(first: 20) {
                edges {
                  node {
                    id
                    orderNumber
                    processedAt
                    financialStatus
                    fulfillmentStatus
                    totalPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        `,
      variables: { token },
    }),
  });

  const json = await res.json();

  if (!json.data?.customer) {
    throw new Error("Invalid customer token");
  }

  return json.data.customer;
}
