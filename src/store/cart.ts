import { create } from "zustand";

type CartItem = {
  productID: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

type addToCartItem = Omit<CartItem, "quantity">;

interface CartState {
  items: CartItem[]; // Array of product IDs
  addToCart: (newItem: addToCartItem) => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addToCart: (newItem) => {
    set((state) => {
      const duplicateItems = [...state.items];

      const existingItemIndex = duplicateItems.findIndex(
        (item) => item.productID === newItem.productID,
      );

      if (existingItemIndex === -1) {
        duplicateItems.push({
          productID: newItem.productID,
          name: newItem.name,
          price: newItem.price,
          imageUrl: newItem.imageUrl,
          quantity: 1,
        });
      } else {
        const itemsUpdate = duplicateItems[existingItemIndex];
        if (!itemsUpdate) return {
            ...state, 
        };
        itemsUpdate.quantity += 1;
      }
      return {
        ...state,
        items: duplicateItems,
      };
    });
  },
})); //Currying function
