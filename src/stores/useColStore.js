import { create } from "zustand";

export default create((set, get) => ({
    collection: null,
    setCol: (collection) => set({collection}),
    getColId: () => {
        return get().collection?.id;
    }
}));