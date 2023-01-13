export type targetProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export interface IProductPage {
  render(targetProduct: targetProduct): void;
}

type PartlylocalStorage = Pick<targetProduct, 'brand' | 'category' | 'id' | 'price' | 'title'>;
export interface LocalStorage extends PartlylocalStorage {
  quantity: number;
}
