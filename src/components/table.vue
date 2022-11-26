<template>
  <q-table title="" flat :rows="lists" :columns="columns" row-key="name"
    hide-pagination :loading="loading">
    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <div class="row justify-end no-wrap">
          <q-btn class="q-mr-sm" unelevated dense size="11px" round
            v-if="showView" color="green" @click="() => $router.push({
              name: 'statistique',
              params: {
                id: props.row.id, title: props.row.description, key: props.row.api_key
              }
            })" icon="show_chart" />
          <q-btn round color="amber" @click="handleUpdate(props.row)"
            size="11px" unelevated dense icon="edit" />
          <q-btn class="q-ml-sm" unelevated dense size="11px" round v-if="show"
            color="red" @click="deleteItems(props.row.id)" icon="delete" />
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "table-page",
  props: {
    lists: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
    showView: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["updateItem", "deleteItem"],
  setup(props, { emit }) {
    const handleUpdate = (item) => {
      emit("updateItem", item);
    };

    const deleteItems = (item) => {
      emit("deleteItem", item);
    };
    return { handleUpdate, deleteItems };
  },
});
</script>

<style scoped>

</style>
