<template>
  <div
    class="grid-models"
    ref="clickoutsidetarget"
    :class="{ somethingisopen: !!open }"
    v-if="models && models.length > 0"
  >
    <table
      :class="{
        rowfocus: typeof row === 'number',
        columnfocus: typeof column === 'number',
      }"
    >
      <thead>
        <tr>
          <td class="name"></td>
          <td
            v-for="(param, pk) in params.filter((x) =>
              x.types.includes(filters.type)
            )"
            :key="param.ref"
            :class="{ active: column === pk }"
          >
            <div class="param-name" @click="bus.emit(param.ref)">
              {{ param.name }}
            </div>
          </td>
        </tr>
      </thead>
      <tbody
        @mouseleave="
          row = null;
          column = null;
        "
      >
        <tr
          class="model"
          v-for="(item, k) in models"
          :key="item.filename"
          :class="{ active: row === k }"
          @mouseenter="row = k"
          @click="router.push(`/model/${item.filename}`)"
        >
          <td class="info">
            <div class="name">
              {{ item.system.name || "(undefined)" }}
            </div>
            <div class="org" v-if="item?.org">
              by {{ item.org.name || "(undefined)" }}
            </div>
          </td>
          <td
            v-for="(param, pk) in params.filter((x) =>
              x.types.includes(filters.type)
            )"
            :key="param.ref"
            class="the-score"
            @mouseenter="column = pk"
            :class="[`is-${item[param.ref]?.class}`, { active: column === pk }]"
          >
            <div
              class="icon"
              v-if="item[param.ref]?.class === 'open'"
              v-html="openIcon"
            />
            <div
              class="icon"
              v-else-if="item[param.ref]?.class === 'partial'"
              v-html="partialIcon"
            />
            <div
              class="icon"
              v-else-if="item[param.ref]?.class === 'closed'"
              v-html="closedIcon"
            />
            <div v-else>-</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";
import { useEventBus } from "@vueuse/core";
const store = useMyComparisonStore();
const router = useRouter();
const row: Ref<null | number> = ref(null);
const column: Ref<null | number> = ref(null);
const { models, version, filters } = defineProps([
  "models",
  "version",
  "filters",
]);
const open = ref();
const openParam = ref();
const bus = useEventBus("description");

const { color, params, categories } = useModels(version);

function setOpenParam(item) {
  open.value = item;
}
function getCatName() {
  const catref = params.value.find((x) => x.ref === openParam.value).category;
  return categories.value.find((x) => x.ref === catref).name;
}
</script>

<style lang="less" scoped>
.grid-models {
  padding: 0;
  overflow: visible;
  @media (max-width: 50rem) {
    overflow: auto;
  }
}
.icon {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  padding: 0;
  margin: 0;

  :deep(svg) {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
}
table {
  width: 100%;
  min-width: 30rem;
  // padding-right: 6rem;
  border-right: 1px solid var(--bg2);
  border-left: 1px solid var(--bg2);
  border-bottom: 2rem solid var(--bg2);
}
thead {
  position: sticky;
  top: calc(4.25rem - 1px);
  z-index: 1;
  transition: all 0.3s ease;

  .nottop.scroll-up & {
    position: relative;
    top: 0;
  }
  td {
    border-bottom: 1px solid var(--bg3);
    position: relative;
    height: 6.5rem;
    overflow: visible;
    color: var(--fg);
    background: var(--bg2);
    &:first-child {
      // background: transparent;
      opacity: 0.75;
    }
  }
}
table.rowfocus tbody {
  tr {
    opacity: 0.5;
    transition: all 0.1s ease;
    &.active {
      opacity: 1;
    }
  }
}
table.columnfocus {
  thead {
    td {
      opacity: 1;
      .param-name {
        color: var(--fg2) !important;
      }
      &.active {
        opacity: 1;
        .param-name {
          color: var(--fg) !important;
        }
      }
    }
  }
}
.param-name {
  position: absolute;
  font-size: 0.6rem;
  color: var(--fg2);
  transform: rotate(-45deg);
  bottom: 0.5rem;
  left: 0.75rem;
  transform-origin: bottom left;
  width: 8rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  &:hover {
    color: var(--fg);
    &:after {
      content: "?";
    }
  }
}

tbody {
  tr {
    cursor: pointer;
  }
  tr:nth-child(odd) {
    background-color: var(--bg);
  }
  td {
    &:last-child {
      padding-right: 2rem;
    }
  }
}

.info {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  .name {
  }
  .org {
    font-size: 0.75rem;
    color: var(--fg2);
  }
}
.the-score {
  width: 2rem;
  transition: transform 0.2s ease;
  transform-origin: center;
  &:hover {
    transform: scale(1.2);
  }
}
.is-closed {
  color: var(--g1);
}

.is-partial {
  color: var(--g2);
}

.is-open {
  color: var(--g3);
}

each(range(1, 100, 1), {
  thead td:nth-child(@{value}) {
    z-index: 100 - @value
  }
});
</style>
