export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    brand: string;
    quantity?: number;
}

export interface CartItem {
    name: string;
    price: string;
    quantity: number;
    total: string;
}

export interface UserInfo {
    name: string;
    email: string;
    password: string;
    title?: 'Mr.' | 'Mrs.';
    birthDate?: string; // DD/MM/YYYY
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    country?: string;
    state?: string;
    city?: string;
    zipcode?: string;
    mobile?: string;
}