<script setup>
  import { ref } from 'vue'

  // Data properties
  let result = ref(0)

  const supportedOperations = {
    buttons: ['AC', 'C', '%', '/', 1, 2, 3, '*', 4, 5, 6, '-', 7, 8, 9, '+', 0, '.', '='],
    '+': {
      operation: (x, y) => x + y,
      icon: 'plus'
    },
    '-': {
      operation: (x, y) => x - y,
      icon: 'minus'
    },
    '*': {
      operation: (x, y) => x * y,
      icon: 'xmark'
    },
    '/': {
      operation: (x, y) => x / y,
      icon: 'divide'
    },
    '%': {
      operation: (x, y) => `${~~((x / y) * 100)}%`, // ~~ is the same as Math.round()
      icon: 'percent'
    },
    '^': {
      operation: (x, y) => Math.pow(x, y),
      icon: 'angle-up'
    }
  }

  const arrLastItem = supportedOperations.buttons.length - 1


  // Functions
  const clear = () => result.value = 0

  const removeLastChar = () => {
    result.value = result.value.toString().slice(0, -1)
    !result.value.length ? clear() : false
  }

  const verifyOutput = item => {
    switch (item) {
      case 0:
        // Not start with consecutive zero's at start of input
        if (result.value.toString().match(/^0{2}\d*/)) {
          removeLastChar()
          return
        }
        break
      case '.':
        // More than one .
        if (result.value.toString().match(/\.[\d]*\./)) {
          removeLastChar()
          return
        }
        break
      case '+':
      case '*':
      case '/':
      case '%':
        // Should not start with 0 + / - * %
        if (result.value.toString() === '0' + item) {
          clear()
          return
        }

        // Should not start with + / * %
        if (result.value.toString().startsWith(item)) {
          clear()
          return
        }

        // Consecutive operators
        const pattern = new RegExp(`[\\+\\-\\/\\*\\%][\\${item}]`)
        if (result.value.toString().match(pattern)) {
          clear()
          return
        }
        break
      case '-':
        // -- not allowed, x- or ÷- are ok
        if (result.value.toString().match(/\-\-/)) {
          removeLastChar()
          return
        }
        break
      }
  }

  const setOutput = item => {
    result.value === 0 ? result.value = '' : false
    result.value += `${item}`
    verifyOutput(item)
  }

  const mathOperation = sign => {
    let nums = result.value.match(/\d+(\.\d+)?/g)
    result.value = supportedOperations[sign].operation(parseFloat(nums[0]), parseFloat(nums[1]))
  }

  const execute = () => {
    switch (true) {
      case result.value.includes('%'):
        mathOperation('%')
        break
      case result.value.includes('/'):
        mathOperation('/')
        break
      case result.value.includes('*'):
        mathOperation('*')
        break
      case result.value.includes('-'):
        mathOperation('-')
        break
      case result.value.includes('+'):
        mathOperation('+')
        break
    }
  }

  const isObjInclude = item => Object.keys(supportedOperations).includes(item)

  const btnClick = (item) => {
    switch (item) {
      case 'AC':
        clear()
        break
      case 'C':
        removeLastChar()
        break
      case '=':
        execute()
        break
      default:
        setOutput(item)
    }
  }
</script>

<template>
  <div class="flex items-center justify-center flex-col w-screen min-h-screen bg-slate-100">
    <div class="block w-[34rem] h-[34rem] p-3 bg-white border border-gray-200 rounded-lg shadow bg-white m-auto">
        <div class="calculator grid grid-cols-4 grid-rows-7 gap-1 h-full">
          <div class="output flex items-center justify-end col-span-4 row-span-2 grid-rows-1 text-end text-6xl p-2 pe-11 text-slate-700">{{ result }}</div>
          <div
              v-for="(item, index) in supportedOperations.buttons"
              :key="index"
              class="flex items-center justify-center p-1 text-slate-600 text-2xl cursor-pointer bg-violet-100 hover:bg-violet-200 hover:transition-all"
              :class="{
                  'col-span-2 custom-red text-white text-4xl font-bold !bg-rose-500 hover:!bg-rose-600': index === arrLastItem,
                  'text-white text-4xl font-bold !bg-purple-600 hover:!bg-purple-700': isObjInclude(item)
                }"
              @click="btnClick(item)"
            >
              <font-awesome-icon v-if="isObjInclude(item)" :icon="['fa-solid', `fa-${supportedOperations[item].icon}`]" class="icon"/>
              <font-awesome-icon v-else-if="index === arrLastItem" icon="fa-solid fa-equals" class="icon"/>
              <span v-else>{{ item }}</span>
            </div>
        </div>
    </div>
  </div>
</template>
