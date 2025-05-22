<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="$emit('update:open', false)">
      <!-- backdrop -->
      <div class="fixed inset-0 bg-black/50"/>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                <form
                    class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                    @submit.prevent="submitDeposit"
                >
                  <!-- Header -->
                  <div class="bg-gray-50 px-4 py-6 sm:px-6 flex justify-between items-center">
                    <DialogTitle class="text-lg font-semibold text-gray-900">New Deposit</DialogTitle>
                    <button @click="$emit('update:open', false)" type="button">
                      <XMarkIcon class="size-6 text-gray-500 hover:text-gray-700"/>
                    </button>
                  </div>

                  <!-- Body -->
                  <div class="flex-1 space-y-6 py-6 sm:divide-y sm:divide-gray-200 px-4 sm:px-6">
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                      <label for="amount" class="block text-sm font-medium text-gray-900">Amount</label>
                      <div class="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                            id="amount"
                            type="number"
                            v-model.number="amount"
                            min="0"
                            required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                      <label for="reference" class="block text-sm font-medium text-gray-900">Reference</label>
                      <div class="mt-1 sm:col-span-2 sm:mt-0">
                        <textarea
                            rows="4"
                            id="reference"
                            type="text"
                            v-model="reference"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
                  </div>

                  <!-- Footer -->
                  <div class="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6 flex justify-end space-x-3">
                    <button
                        @click="$emit('update:open', false)"
                        type="button"
                        class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {{ loading ? 'Submitting…' : 'Create' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {XMarkIcon} from '@heroicons/vue/24/outline'

defineProps({open: Boolean});
const emit = defineEmits(['update:open, deposited'])

// reactive form fields & state
const amount = ref(null)
const reference = ref('')
const loading = ref(false)
const error = ref('')

async function submitDeposit() {
  loading.value = true
  error.value = ''

  try {
    const res = await axios.post(
        `/accounts/deposit`,
        {amount: amount.value, reference: reference.value},
    )

    // successful → close panel & reset
    emit('deposited')
    emit('update:open', false)
    amount.value = null
    reference.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not submit deposit.'
  } finally {
    loading.value = false
  }
}
</script>
