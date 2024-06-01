<template>
    <button @click="forceRerender()">Re-render</button>
    <keep-alive>
        <ItemNode :items="items" v-if="renderComponent" :level="0" />
    </keep-alive>
</template>

<script>
import { computed, nextTick, onMounted, ref } from "vue";
import { useStore } from "vuex";

import ItemNode from "@/components/ItemNode.vue";

export default {
    components: { ItemNode },
    name: "App",
    setup() {
        const store = useStore();
        onMounted(() => store.dispatch("fetchItems"));

        const items = computed(() => store.getters.getItems);

        const renderComponent = ref(true);

        async function forceRerender() {
            renderComponent.value = false;
            await nextTick();
            renderComponent.value = true;
        }

        return {
            items,
            forceRerender,
            renderComponent
        };
    },
};
</script>

<style>
body {
    padding: 20px;
    margin: 0;
}

button {
    margin: 0 0 20px 0;
}
</style>
