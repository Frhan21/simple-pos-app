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
  increaseQuantity: (productID: string) => void;
  decreaseQuantity: (productID: string) => void;
  clearCart: () => void;
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
        if (!itemsUpdate)
          return {
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
  clearCart: () => {
    set((currentState) => {
      return {
        ...currentState,
        items: [],
      };
    });
  },
  increaseQuantity: (productID) => {
    set((state) => ({
      ...state,
      items: state.items.map((item) =>
        item.productID === productID
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    }));
  },
  decreaseQuantity: (productID) => {
    set((state) => {
      const target = state.items.find((item) => item.productID === productID);
      if (!target) return state;

      if (target.quantity <= 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.productID !== productID),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productID === productID
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };
    });
  },
})); //Currying function
