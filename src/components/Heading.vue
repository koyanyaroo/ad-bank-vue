<template>
  <div class="overflow-hidden rounded-lg bg-white shadow">
    <div class="bg-white p-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex sm:space-x-5">
          <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
            <p class="text-sm font-medium text-gray-600">Welcome back,</p>
            <p class="text-xl font-bold text-gray-900 sm:text-2xl">{{ name }}</p>
          </div>
        </div>
        <div class="mt-5 flex justify-center sm:mt-0">
          <a @click="toggleForm()"
             class="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Deposit
            Fund</a>
        </div>
      </div>
    </div>
    <div
        class="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div class="px-6 py-5 text-left text-sm font-medium">
        <span class="text-gray-900">Current balance</span>
        {{ ' ' }}
        <span class="text-gray-600">${{ balance }}</span>
      </div>
    </div>
  </div>
  <DepositForm v-model:open="isOpenForm" @deposited="$emit('reload')"/>
</template>

<script setup>
import DepositForm from "./DepositForm.vue";
import {onMounted, ref, watch} from "vue";
import axios from "axios";

const isOpenForm = ref(false)
const toggleForm = () => {
  isOpenForm.value = !isOpenForm.value
}

async function loadData() {
  try {
    const res = await axios.get('/accounts/balance')
    balance.value = res.data.data.balance
  } catch {
    balance.value = 0.00
  }
}

const balance = ref(0.00)

const props = defineProps({
  reloadKey: Number,
  name: String,
})

watch(() => props.reloadKey, () => {
  loadData()
})

onMounted(loadData)
</script>