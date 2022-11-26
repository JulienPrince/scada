<template>
  <q-item clickable :class="route.name === link ? 'hight' : ''"
    @click="$router.push({ name: link, params: { title: title } })">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <div class="text-subtitle1 text-weight-medium">
          {{ title }}
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  setup() {

    const route = useRoute()
    return { route }
  }
})
</script>
<style scoped>
.hight {
  background: rgba(92, 92, 92, 0.089);
}
</style>
