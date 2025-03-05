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
      @mouseleave="modelKey = null"
    >
      <thead>
        <tr>
          <td class="name"></td>
          <td
            v-for="(param, pk) in paramsFiltered"
            :key="param.ref"
            :class="{ active: column === pk }"
          >
            <div class="param-name" @click="bus.emit(param.ref)">
              {{ param.name }}
            </div>
          </td>
          <td class="margin"></td>
        </tr>
      </thead>
      <tbody
        class="model"
        v-for="(item, k) in models"
        :key="item.filename"
        :class="{ active: row === k }"
        @mouseenter="row = k"
        @mouseleave="
          row = null;
          column = null;
          modelKey = null;
        "
      >
        <tr>
          <td class="info" @click="router.push(`/model/${item.filename}`)">
            <div class="name">
              {{ item.system.name || "(undefined)" }}
            </div>
            <div class="org" v-if="item?.org">
              by {{ item.org.name || "(undefined)" }}
            </div>
            <div class="basemodel" v-if="item?.org">
              {{ item.system?.basemodelname || "(unspecified)" }}
            </div>
          </td>
          <td
            v-for="(param, pk) in paramsFiltered"
            :key="param.ref"
            class="the-score"
            @mouseenter="
              column = pk;
              modelKey = k;
            "
            @click="
              column = pk;
              modelKey = k;
            "
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
          <td class="margin"></td>
        </tr>
        <tr class="param-hover-info" v-if="modelKey === k">
          <td></td>
          <td class="param-content" :colspan="paramsFiltered.length + 1">
            <div
              class="param-content-frame"
              v-if="column !== null && item[paramsFiltered[column].ref]"
            >
              <div class="name" @click="bus.emit(paramsFiltered[column].ref)">
                {{ paramsFiltered[column].name }}
              </div>
              <div class="notes" v-if="item[paramsFiltered[column].ref].notes">
                {{ item[paramsFiltered[column].ref].notes }}
              </div>
              <div class="links" v-if="item[paramsFiltered[column].ref].link">
                <NuxtLink
                  :to="item[paramsFiltered[column].ref].link"
                  target="_blank"
                  v-if="
                    typeof item[paramsFiltered[column].ref].link === 'string'
                  "
                >
                  {{ item[paramsFiltered[column].ref].link }}
                </NuxtLink>
                <NuxtLink
                  :to="link"
                  target="_blank"
                  v-else
                  v-for="link in item[paramsFiltered[column].ref].link"
                  >{{ link }}
                </NuxtLink>
              </div>
            </div>
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
import { intersection } from 'lodash-es'
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
const modelKey = ref();
const bus = useEventBus("description");

const { color, params, categories } = useModels(version);
const paramsFiltered = computed(() => {
  console.log( filters?.type)
  const temptype = filters?.type.split(',') || ["text"];
  return params.value.filter((x) => intersection(x?.types, temptype).length > 0); 
});

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
  padding-bottom: 1rem;
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
  // border-bottom: 2rem solid var(--bg2);
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
    // border-bottom: 1px solid var(--bg3);
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
  opacity: 0.5;
  transition: all 0.1s ease;
  &.active {
    opacity: 1;
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
  position: relative;
  tr {
    cursor: pointer;
    position: relative;
  }
  &:nth-child(odd) {
    background-color: var(--bg);
  }
  td {
    text-align: center;
    &:first-child {
      text-align: left;
    }
    &:last-child {
      padding-right: 2rem;
    }
  }

  tr.param-hover-info {
    background: transparent;
    height: 0;
    padding: 0;
    position: relative;
    z-index: 9;
    width: 100%;
    min-width: 40rem;
    td {
      text-align: left;
    }

    .param-content {
      position: relative;
      overflow: visible;
      .param-content-frame {
        position: absolute;
        background: var(--bg);
        width: 100%;
        top: -1rem;
        font-size: 0.75rem;
        padding: 0.5rem 1rem 1rem;
        border-radius: 0 0 0.25rem 0.25rem;
        box-shadow: 0 0.125rem 0.125rem var(--shadow);

        .slidedown();
        z-index: -1;
        .dark & {
          background: var(--bg3);
        }
        .name {
          margin-bottom: 0.25rem;
        }
        .notes {
          color: var(--fg2);
          margin-bottom: 0.25rem;
        }
        .links {
          font-size: 0.6rem;
          color: var(--fg2);
        }
      }
    }
  }
  &:hover {
    background: var(--bg);
    .dark & {
      background: var(--bg3);
    }
    td {
      &.the-score {
        opacity: 0.5;
      }
      &:first-child {
        // background: transparent;
      }
    }
  }
}

.info {
  padding: 0.5rem 0.5rem 0.75rem 3rem;
  min-width: 20rem;
  .name {
  }
  .org {
    font-size: 0.75rem;
    color: var(--fg2);
  }
  .basemodel {
    font-size: 0.75rem;
    color: var(--fg2);
    &:before {
      content: "Base models: ";
      opacity: 0.5;
    }
  }
  &:hover {
    .name {
      text-decoration: underline;
    }
  }
}
.the-score {
  width: 2rem;
  transition: transform 0.2s ease;
  transform-origin: center;
  &:hover {
    opacity: 1 !important;
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
