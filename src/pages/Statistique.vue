<template>
  <div class="q-pa-md">
    <div class="">
      <q-card class="q-mt-md  q-mr-xs ">
        <q-card-section>
          <div>
            <div class="text-subtitle1 text-bold">Température</div>
            <line-chart unity="°C" :stepSize="5" name="Température"
              field="field1" :capChanelId="$route.params.id"
              :capKey="$route.params.key" />
          </div>
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md ">
        <q-card-section>
          <div>
            <div class="text-subtitle1 text-bold">PH</div>
            <line-chart unity="PH" :stepSize="1" name="PH" field="field2"
              :capChanelId="$route.params.id" :capKey="$route.params.key" />
          </div>
        </q-card-section>
      </q-card>

    </div>
    <div class="q-mt-lg">
      <q-card>
        <q-card-section>
          <div class="q-pa-md">
            <div class="text-subtitle1 text-bold">Débit</div>
            <line-chart unity="L" field="field4" name="Débit"
              :capChanelId="$route.params.id" :capKey="$route.params.key"
              :stepSize="100" />
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="q-mt-lg text-h4 text-bold">Historique</div>
    <div class="q-mt-md">
      <q-card class="q-mt-md">
        <q-card-section>
          <div>
            <div class="text-subtitle1 text-bold">Température dernier 24H</div>
            <line-chart-static unity="°C" :stepSize="5" name="Température"
              field="field1" :capChanelId="$route.params.id"
              :capKey="$route.params.key" />
          </div>
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md ">
        <q-card-section>
          <div>
            <div class="text-subtitle1 text-bold">PH dernier 24H</div>
            <line-chart-static unity="PH" :stepSize="0.5" name="PH"
              field="field2" :capChanelId="$route.params.id"
              :capKey="$route.params.key" />
          </div>
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md ">
        <q-card-section>
          <div class="q-pa-md">
            <div class="text-subtitle1 text-bold">Débit dernier 24H</div>
            <line-chart-static unity="L" field="field4" name="Débit"
              :capChanelId="$route.params.id" :capKey="$route.params.key"
              :stepSize="50" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive } from 'vue'
import LineChart from 'src/components/LineChart.js'
import LineChartStatic from 'src/components/LineChartStatic.js'

export default defineComponent({
  name: 'statistique-page',
  components: { LineChart, LineChartStatic },
  setup() {
    // http://102.16.65.172:8080/channels/10/feed.json?key=CY7O2AQ8OITRL253 state
    // http://102.16.65.172:8080/update?key=36ZF9MB9TKJXPXVD&field2=26&field1=27&field3=1 update
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.width {
  width: 500px !important;
}
</style>
