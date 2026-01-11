export type Product = {
  id: string;
  name: string;
  price: number;
  image: string; // filename bajo /public/products o URL remota
  description?: string;
  category?: string;
  inStock?: number; // opcional
};

export type CartItem = {
  product: Product;
  qty: number;
};

export type DeliveryMethod = "PICKUP" | "DELIVERY" | "INTERDEPT";
export type PaymentMethod = "PAY_ON_SITE" | "PAY_QR";

export type InterdeptDepartment =
  | "Beni"
  | "Chuquisaca"
  | "Cochabamba"
  | "La Paz"
  | "Oruro"
  | "Pando"
  | "Potosí"
  | "Santa Cruz"
  | "Tarija";

export type OrderDraft = {
  items: { id: string; name: string; unitPrice: number; qty: number }[];
  subtotal: number;

  deliveryMethod: DeliveryMethod;

  address?: string;
  deliveryDate?: string; // YYYY-MM-DD
  deliveryTime?: string; // HH:MM
  interdeptDepartment?: InterdeptDepartment;

  paymentMethod: PaymentMethod;

  customerName: string;
  customerPhone: string;
  notes?: string;
};
