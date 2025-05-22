<template>
  <Listbox v-model="selectedInternal">
    <div class="relative mt-2">
      <!-- button -->
      <ListboxButton
          class="grid w-full cursor-default grid-cols-1
               rounded-md bg-white py-1.5 pl-3 pr-2 text-left
               text-gray-900 outline outline-1 -outline-offset-1
               outline-gray-300 focus:outline focus:outline-2
               focus:-outline-offset-2 focus:outline-indigo-600
               sm:text-sm/6"
      >
        <span class="col-start-1 row-start-1 flex w-full gap-2 pr-6">
          <span class="truncate">
            {{ selectedInternal?.value ?? placeholder }}
          </span>
          <span v-if="selectedInternal?.key" class="truncate text-gray-500">
            {{ selectedInternal.key }}
          </span>
        </span>
        <ChevronUpDownIcon
            class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            aria-hidden="true"
        />
      </ListboxButton>

      <!-- options panel -->
      <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                 rounded-md bg-white py-1 text-base shadow-lg
                 ring-1 ring-black/5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
              v-for="item in items"
              :key="item.key"
              :value="item"
              as="li"
              v-slot="{ active, selected }"
              :class="[
              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
              'relative cursor-default select-none py-2 pl-3 pr-9'
            ]"
          >
            <div class="flex">
              <span
                  :class="[selected ? 'font-semibold' : 'font-normal', 'truncate']"
              >
                {{ item.value }}
              </span>
              <span
                  :class="[active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate']"
              >
                {{ item.key }}
              </span>
            </div>
            <span
                v-if="selected"
                :class="[
                active ? 'text-white' : 'text-indigo-600',
                'absolute inset-y-0 right-0 flex items-center pr-4'
              ]"
            >
              <CheckIcon class="size-5" aria-hidden="true" />
            </span>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/16/solid'
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  items:       { type: Array, required: true },
  modelValue:  { type: Object, default: null },
  placeholder: { type: String, default: 'Select…' }
})

const emit = defineEmits(['update:modelValue'])

// proxy for v-model
const selectedInternal = computed({
  get:  () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>
