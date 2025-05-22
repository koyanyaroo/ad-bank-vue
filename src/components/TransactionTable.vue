<template>
  <div class="mt-10 px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Transactions</h1>
        <p class="mt-2 text-sm text-gray-700">Transactions list from your account.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
            @click="toggleForm()"
            type="button"
            class="block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Make Transfer Fund
        </button>
      </div>
    </div>

    <div class="-mx-4 mt-8 flow-root sm:mx-0">
      <table class="min-w-full">
        <thead class="border-b border-gray-300">
        <tr>
          <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Date</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">From</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To</th>
          <th class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Amount</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reference</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="tx in transactions"
            :key="tx.id"
            class="border-b border-gray-200 hover:bg-gray-50"
        >
          <td class="py-5 pl-4 pr-3 text-sm text-gray-700 sm:pl-0">
            {{ formatDate(tx.created_at) }}
          </td>
          <td class="px-3 py-5 text-sm text-gray-700">{{ tx.from_account }}</td>
          <td class="px-3 py-5 text-sm text-gray-700">{{ tx.to_account }}</td>
          <td class="px-3 py-5 text-sm text-gray-700 text-right">${{ tx.amount }}</td>
          <td class="px-3 py-5 text-sm text-gray-700">{{ tx.reference }}</td>
          <td class="px-3 py-5 text-sm text-gray-700">{{ tx.entry_type }}</td>
          <td class="px-3 py-5 text-sm" :class="statusClass(tx.status)">
            {{ tx.status }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Your transfer form slide-over -->
    <TransferForm v-model:open="isOpenForm" @transferred="$emit('reload')" @push-notification="$emit('push-notification')"/>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue'
import axios from 'axios'
import TransferForm from './TransferForm.vue'

const props = defineProps({
  reloadKey: Number,
})

async function loadData() {
  try {
    const res = await axios.get('/accounts/transactions')
    transactions.value = res.data.data
  } catch {
    transactions.value = []
  }
}

watch(() => props.reloadKey, () => {
  loadData()
})

onMounted(loadData)

const transactions = ref([])
const isOpenForm   = ref(false)

function toggleForm() {
  isOpenForm.value = !isOpenForm.value
}

// format a timestamp
function formatDate(ts) {
  return new Date(ts).toLocaleString()
}

// dynamic status colouring
function statusClass(status) {
  return {
    'text-green-600': status === 'COMPLETED',
    'text-yellow-600': status === 'PENDING',
    'text-red-600': status === 'FAILED',
  }
}
</script>
