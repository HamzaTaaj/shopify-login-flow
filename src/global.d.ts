declare global {
  interface Window {
    shopifyResetPassword?: (email: string) => void;
  }
}

declare const shopifyResetPassword: (email: string) => void;

export {};
