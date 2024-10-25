<template>
  <div>
    <div class="models">
      <table>
        <thead>
          <tr>
            <td class="score">Score</td>
            <td class="name">Name</td>
            <td class="org">Organisation</td>
            <!-- <td class="org">LLM Base</td>
            <td class="org">RL Base</td> -->
            <td class="fold"></td>
          </tr>
        </thead>
        <tbody class="model" v-for="(item, k) in models" :class="{ active: store.selected.includes(item.filename) }"
          @click.exact="toggleFold(item.filename)" @click.meta="router.push(`/model/${item.filename}`)">
          <tr :style="bg(item.score)">
            <td class="score">
              <scorebar :score="item.score"></scorebar>
              <!-- <span>{{ item.score.toFixed(2) }}</span> -->
            </td>
            <td class="name">
              {{ item.system.name || '(undefined)' }}
            </td>
            <td class="org" v-if="item?.org">
              {{ item.org.name || '(undefined)' }}
            </td>
            <td class="fold">
              <Icon icon="ic:round-arrow-drop-up" v-if="folded.includes(item.filename)"></Icon>
              <Icon icon="ic:round-arrow-drop-down" v-else></Icon>
            </td>
          </tr>
          <tr v-if="folded.includes(item.filename)" class="info">
            <td colspan="10">
              <ModelInfoFold :filename="item.filename"></ModelInfoFold>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
const router = useRouter();
const { models, bg } = useModels()
const store = useMyComparisonStore()
const folded = ref<Array<string>>([])
function toggleFold(filename: string) {
  if (folded.value.includes(filename)) {
    folded.value.splice(folded.value.indexOf(filename), 1)
  } else {
    folded.value.push(filename)
  }
}
</script>

<style lang="less" scoped>
.models {
  .row();
  margin: 4rem auto;
}

table {
  width: 100%;
  overflow: hidden;

  thead {
    font-size: 0.75rem;
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 9;

    td {
      line-height: 1;
    }

    tr {
      box-shadow: 0 0 0.25rem var(--shadow);
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid var(--bg);
    }
  }

  td {
    padding: 0.75rem 0.5rem;

    &.fold {
      width: 2rem;
    }

    &.score {
      width: 5rem;
    }
  }
}

.model {
  color: var(--listfg);
  padding: 0.5em 1em;
  margin-bottom: 1px;
  text-decoration: none;
  align-items: center;
  user-select: none;

  tr:first-child {
    cursor: pointer;
  }

  .checkbox {
    line-height: 1;
    cursor: pointer;
  }

  .name {
    width: 20rem;
  }

  .org {
    // font-size: 0.75rem;
  }

  .name,
  .org {
    a {
      opacity: 0;
      margin-left: 0.5rem;
      line-height: 1;
      padding: 0;
      transition: 0.2s ease;
    }
  }

  .score {
    text-align: left;
    --fg: var(--listfg);
    --bg: color-mix(in srgb, var(--bg2) 25%, transparent);

    span {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25em;
      // background: var(--bg);
      // color: var(--score);

      background: rgba(#000, 0.1);
      // color: var(--bg);
    }
  }

  .fold {
    position: relative;
    width: 3rem;
    opacity: 0.5;

    :deep(svg) {
      position: absolute;
      font-size: 2rem;
      top: 0;
      height: 100%;
      // padding: 0;
      display: flex;
      // align-items: center;
      // height: 100%;
      // outline: 1px solid var(--fg);
    }
  }

  &:hover {
    .fold {
      opacity: 1;
    }

    .name,
    .org {
      a {
        opacity: 1;
      }
    }
  }
}

.info {
  color: var(--fg);
  border-bottom: 1rem solid var(--bc);

  .model-info {
    padding-top: 2rem !important;
  }

  td {
    padding: 0;
  }
}
</style>