<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @click="$emit('update:open', false)">
      <div class="fixed inset-0"/>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700"
                             enter-from="translate-x-full" enter-to="translate-x-0"
                             leave="transform transition ease-in-out duration-500 sm:duration-700"
                             leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                <form @submit.prevent="submit" class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div class="flex-1">
                    <!-- Header -->
                    <div class="bg-gray-50 px-4 py-6 sm:px-6">
                      <div class="flex items-start justify-between space-x-3">
                        <div class="space-y-1">
                          <DialogTitle class="text-base font-semibold text-gray-900">New transfer</DialogTitle>
                          <p class="text-sm text-gray-500">Get started by filling in the information below to create
                            your new project.</p>
                        </div>
                        <div class="flex h-7 items-center">
                          <button type="button" class="relative text-gray-400 hover:text-gray-500"
                                  @click="$emit('update:open', false);resetErrors();resetInput()">
                            <span class="absolute -inset-2.5"/>
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="size-6" aria-hidden="true"/>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Divider container -->
                    <div class="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                      <div class="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label for="project-name" class="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">To
                            account</label>
                        </div>
                        <div class="sm:col-span-2">
                          <Dropdown
                              v-model="selectedAccount"
                              :items="accounts"
                              placeholder="Select an account"
                          />
                          <p v-if="errors.to_account" class="mt-1 text-sm text-red-600">{{ errors.to_account[0] }}</p>
                        </div>
                      </div>
                      <!-- Project name -->
                      <div class="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label for="amount" class="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">Amount</label>
                        </div>
                        <div class="sm:col-span-2">
                          <input
                              v-model="form.amount"
                              type="text"
                              name="amount"
                              id="amount"
                              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                          <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount[0] }}</p>
                        </div>
                      </div>

                      <!-- Project description -->
                      <div class="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label for="reference"
                                 class="block text-sm/6 font-medium text-gray-900 sm:mt-1.5">Reference</label>
                        </div>
                        <div class="sm:col-span-2">
                          <textarea
                              v-model="form.reference"
                              rows="3"
                              name="reference"
                              id="reference"
                              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action buttons -->
                  <div class="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div class="flex justify-end space-x-3">
                      <button type="button"
                              class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              @click="$emit('update:open', false);resetErrors();resetInput()">Cancel
                      </button>
                      <button type="submit" :disabled="loading"
                              class="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {{ loading ? 'Sending…' : 'Send' }}
                      </button>
                    </div>
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
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {XMarkIcon} from '@heroicons/vue/24/outline'
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import Dropdown from "./Dropdown.vue";

const props = defineProps({open: Boolean})
const emit = defineEmits(['update:open', 'transferred', 'push-notification'])

const accounts = ref([])
const selectedAccount = ref(null)
const form = reactive({amount: '', reference: ''})
const loading = ref(false)
const error = ref('')
const errors = reactive({to_account: [], amount: [], reference: []})

function resetInput() {
  form.amount = ''
  form.reference = ''
  selectedAccount.value = null
}

function resetErrors() {
  error.value = ''
  errors.to_account = []
  errors.amount = []
  errors.reference = []
}
async function submit() {
  resetErrors()
  try {
    await axios.post('/accounts/transfer', {
      to_account: selectedAccount.value.value,
      amount: form.amount,
      reference: form.reference
    })
    emit('transferred')
    emit('update:open', false)
    emit('push-notification', {
      type: 'success',
      message: 'Transfer successful',
    })
    resetInput()
  } catch (e) {
    const resp = e.response?.data
    if (e.response?.status === 409) {
      console.log( e.response?.data?.message)
      errors['amount'][0] = e.response?.data?.message
    }
    console.error(e.response?.status)
    if (resp?.errors) {
      // map server validation errors
      Object.keys(resp.errors).forEach(field => {
        // if error not equal empty array
        if (errors[field] !== undefined && resp.errors[field].length > 0) {
          errors[field] = resp.errors[field]
        }
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const res = await axios.get('/accounts/recipients')
  accounts.value = res.data.data.map(acc => ({
    key: acc.account_name,
    value: acc.account_number
  }))

  // optional: set initial selection
  selectedAccount.value = accounts.value[1]
})

</script>