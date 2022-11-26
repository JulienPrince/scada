<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { api } from 'src/boot/axios'

export default defineComponent({
  name: 'App',
  setup() {

    const interval1 = ref()
    const interval2 = ref()
    const updateData = async (key, value1, value2, value3, id) => {
      await api.get(`channels/${id}/feeds/last`, {
        params: {
          key: key
        }
      }).then(async ({ data }) => {
        if (data != -1) {
          await api.get('update', {
            params: {
              key: key,
              field1: value1,
              field2: value2,
              field3: data.field3,
              field4: value3,
            }
          })
        }
      })
    }

    const randomNumber = (max, min) => {
      return Math.round(Math.random() * (max - min) + min)
    }

    onMounted(() => {
      clearInterval(interval1.value)
      clearInterval(interval2.value)
      interval1.value = setInterval(() => {
        updateData('213R9MRRVL6DHU8C', randomNumber(24, 27), randomNumber(5, 7), randomNumber(500, 600), 39)
      }, 4000);
      //envoie de donnée thingspeak
      // interval2.value = setInterval(() => {
      //   updateData('XAEB1JJ6O7MFS3Q6', randomNumber(24, 27), randomNumber(5, 7), randomNumber(500, 600), 43)
      // }, 4000);
    })

    onUnmounted(() => {
      clearInterval(interval1.value)
      clearInterval(interval2.value)
    })
    return {}
  }
})
</script>
