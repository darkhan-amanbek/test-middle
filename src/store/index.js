import { createStore } from "vuex";
import axios from "@/plugins/axios";

export default createStore({
    state: {
        items: [],
    },
    getters: {
        getItems(state) {
            return state.items;
        },
    },
    mutations: {
        updateItems(state, items) {
            state.items = items;
        },
    },
    actions: {
        async fetchItems(context) {
            let items = await axios.get("/tree/items").then(res => res.data);
            context.commit("updateItems", items);
        },
    },
    modules: {},
});
