<template>
    <template v-for="item in getVisibleItems()" :key="item.id">
        <li
            @click="toggleItemActive(item.id)"
            :class="{
                'active': isItemActive(item.id),
                'have-childs': hasChildItems(item.id),
                'root': (level === 0)
            }"
            :style="{ padding: `0 0 0 ${8 * level}px` }"
        >
            <img class="arrow" src="@/assets/arrow.svg" />
            <img class="line" src="@/assets/line.svg" />
            <p>{{ item.title }}</p>
        </li>
        <keep-alive>
            <ItemNode
                v-if="hasChildItems(item.id) && isItemActive(item.id)"
                :items="getAllChildItems(item.id)"
                :parentId="item.id"
                :level="level + 1"
            />
        </keep-alive>
    </template>
</template>

<script>
import ItemNode from "@/components/ItemNode.vue";
import { ref } from "vue";

export default {
    props: ["items", "parentId", "level"],
    components: [ItemNode],
    setup(props) {
        const openedItems = ref([]);

        function isItemActive(id) {
            return openedItems.value.includes(id);
        }

        function toggleItemActive(id) {
            const index = openedItems.value.indexOf(id);
            if (index > -1) {
                openedItems.value.splice(index, 1);
            } else {
                openedItems.value.push(id);
            }
        }

        function getRootItems() {
            return props.items.filter((item) => !item.parent_id);
        }

        function getAllChildItems(id) {
            let childs = [];

            props.items.forEach((item) => {
                if (item.parent_id === id) {
                    childs.push(item);
                    let grandChilds = getAllChildItems(item.id);
                    childs = childs.concat(grandChilds);
                }
            });

            return childs;
        }

        function hasChildItems(id) {
            return props.items.some((item) => item.parent_id === id);
        }

        function getChildItems() {
            return props.items.filter(
                (item) => props.parentId === item.parent_id
            );
        }

        function getVisibleItems() {
            if (props.level === 0) return getRootItems();
            else return getChildItems();
        }

        return { isItemActive, toggleItemActive, getAllChildItems, hasChildItems, getVisibleItems };
    },
};
</script>

<style>
* {
    list-style-type: none;
}

li {
    display: flex;
    align-items: center;
}

li.root {
    background-color: #e4e4e8 !important;
}

li:nth-child(even) {
    background-color: #f6f6f7;
}

li p {
    padding: 0;
    margin: 0 0 0 8px;
}

li img {
    width: 8px;
    height: 8px;
}

li .arrow {
    display: none;
}

li.active > .arrow {
    transform: rotate(90deg);
}

li .line {
    display: block;
}

li.have-childs > .arrow {
    display: block;
}

li.have-childs > .line {
    display: none;
}
</style>
