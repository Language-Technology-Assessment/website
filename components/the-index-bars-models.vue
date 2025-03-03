<template>
  <div
    class="models"
    ref="clickoutsidetarget"
    @touchstart="openParam = false"
    :class="{ somethingisopen: !!open }"
    v-if="models && models.length > 0"
  >
    <div
      class="model"
      v-for="(item, k) in models"
      :key="item.filename"
      :class="{
        active: store.selected.includes(item.filename),
        open: !!open && item.filename === open.filename,
      }"
    >
      <div
        class="content"
        @mouseenter="setOpenParam(item)"
        @mouseleave="
          open = false;
          openParam = false;
        "
      >
        <div class="info" @click="router.push(`/model/${item.filename}`)">
          <div class="title">
            <div class="titleswrap">
              <div class="titlewrap">
                <span class="name">
                  {{ item.system.name || "(undefined)" }}
                </span>
                <span class="org" v-if="item?.org">
                  by {{ item.org.name || "(undefined)" }}
                </span>
              </div>
              <div class="titlewrap">
                <span class="basemodels">
                  {{ item.system.basemodelname || "unspecified" }}
                </span>
              </div>
            </div>
          </div>
          <button
            class="checkbox"
            @click.stop="store.toggle(item.filename)"
            :class="{ active: store.selected.includes(item.filename) }"
          >
            <div>Compare</div>
            <Icon
              icon="uil:check"
              v-if="store.selected.includes(item.filename)"
            ></Icon>
            <Icon icon="basil:plus-outline" v-else></Icon>
          </button>
        </div>
        <div
          class="score"
          :class="{ open: !!open && open.filename === item.filename }"
          @touchstart.stop
        >
          <scorebar
            :score="item.score"
            v-if="!isNaN(item?.score)"
            :style="{ '--fg': color(item.score) }"
          ></scorebar>
          <div
            class="subscore"
            v-if="!!open && open.filename === item.filename"
            @mouseleave="openParam = false"
          >
            <div class="params">
              <div
                class="param"
                v-for="param in params.filter((x) =>
                  x.types.includes(item.system.type)
                )"
                @mouseenter="openParam = param.ref"
                @touchmove="openParam = param.ref"
              >
                <div
                  class="circle-icon open-icon"
                  v-if="item[param.ref]?.class === 'open'"
                  v-html="openIcon"
                ></div>
                <div
                  class="circle-icon closed-icon"
                  v-if="item[param.ref]?.class === 'closed'"
                  v-html="closedIcon"
                ></div>
                <div
                  class="circle-icon partial-icon"
                  v-if="item[param.ref]?.class === 'partial'"
                  v-html="partialIcon"
                ></div>
              </div>
            </div>
            <div class="param-info" v-if="openParam && openParam !== undefined">
              <div class="name">
                <div class="cat-name">{{ getCatName() }}:</div>
                <div class="param-name">
                  {{ params.find((x) => x.ref === openParam).name }}
                </div>
                <button @click="bus.emit(openParam)" class="reference">
                  <Icon icon="mage:question-mark-circle-fill"></Icon>
                </button>
              </div>
              <div
                class="param-notes"
                v-if="item[openParam] && item[openParam].notes"
              >
                {{ item[openParam].notes }}
              </div>
              <div class="param-notes" v-else>(undefined)</div>
              <div
                class="links"
                @click.stop
                v-if="item[openParam] && item[openParam].link"
              >
                <NuxtLink
                  :to="item[openParam].link"
                  target="_blank"
                  v-if="typeof item[openParam].link === 'string'"
                  >{{ item[openParam].link }}</NuxtLink
                >
                <NuxtLink
                  :to="link"
                  target="_blank"
                  v-else
                  v-for="link in item[openParam].link"
                  >{{ link }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
const { models, version } = defineProps(["models", "version"]);
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
.model {
  padding: 0em 0 2.5rem;
  margin-bottom: 1px;
  text-decoration: none;
  align-items: center;
  user-select: none;

  display: flex;
  align-items: flex-start;
  gap: 1rem;

  .models.somethingisopen & {
    opacity: 0.3;
    transition: all ease 1s;
    @media (max-width: 50rem) {
      opacity: 1;
    }
  }

  &.open {
    opacity: 1 !important;
  }

  .content {
    flex: 1;
  }

  .info {
    display: flex;
    margin-bottom: 0.5rem;
    align-items: center;

    .title {
      flex: 1;
      position: relative;
      height: 2.8rem;

      .titleswrap {
        position: absolute;
        max-width: 100%;
      }

      .titlewrap {
        // position: absolute;
        // max-width: 100%;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .basemodels {
          font-size: 0.75rem;
          color: var(--fg2);

          &:before {
            content: "Base models: ";
            opacity: 0.5;
          }
        }
      }
      &:hover {
        .titlewrap {
          > span {
            text-decoration: underline;
          }
        }
      }
    }
    @media (max-width: 40rem) {
      align-items: flex-start;
      .title {
        height: 4rem;
        .titleswrap {
          top: 0;
          height: 5rem;
        }
        .titlewrap {
          span {
            display: block;
          }
        }
        .basemodels {
          margin-top: 0.125rem;
        }
      }
    }

    .name {
      margin-right: 0.5rem;
      cursor: pointer;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .org {
      color: var(--fg2);
      // font-size: 0.75rem;
      margin-right: 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    .checkbox {
      color: var(--fg2);
      padding: 0.25rem 0.25rem 0.25rem 0.75rem;
      font-size: 0.75rem;
      opacity: 0;
      background: transparent;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      line-height: 1;
      position: relative;
      @media (max-width: 50rem) {
        opacity: 1;
      }

      div {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75em;
        opacity: 0;
        transform: translateX(1em);
        transition: all 0.5s @easeInOutExpo;
        position: absolute;
        right: 100%;
        @media (max-width: 50rem) {
          background: var(--bg1);
          padding: 0.5rem;
          z-index: 9;
          bottom: 100%;
          right: 0;
        }
      }

      :deep(svg) {
        width: 1.25rem !important;
        height: 1.25rem !important;
        background: var(--bg3);
        border-radius: 0.25rem;
      }

      &.active {
        color: var(--fg2);
        opacity: 1;

        :deep(svg) {
          color: var(--bg3);
          background: var(--fg);
        }
      }
    }
  }

  .score {
    position: relative;
    flex: 1;
    text-align: left;
    --fg: var(--listfg);
    --bg: var(--bg3);

    &:after {
      content: "";
      position: absolute;
      top: 100%;
      height: 0.5rem;
      width: 100%;
    }

    :deep(.scorebar) {
      width: 100%;
      --sb-height: 1rem;
    }

    &.open {
      :deep(.scorebar) {
        opacity: 1;
      }
    }
  }

  .content:hover {
    cursor: pointer;

    .info {
      .name {
        // text-decoration: underline;
      }

      .checkbox {
        opacity: 1;

        div {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }
  }
}

.models {
  margin: 0 auto;
  padding: 0 3rem 2rem;
  flex: 1;
}

.subscore {
  position: absolute;
  top: 0;
  // top: 1.5rem;
  z-index: 2;
  width: 100%;
  border-radius: 0.5rem;
  // display: flex;
  animation: subscorein 0.4s @easeInOutExpo 0s 1 forwards;
  opacity: 0;

  @keyframes subscorein {
    to {
      opacity: 1;
    }
  }

  .params {
    height: 1.5rem;
    display: flex;
    flex: 1;
    padding: 0;
    overflow: hidden;
    border-radius: 0.25rem;
    background: var(--bg3);
    margin-bottom: 1px;

    &:hover {
      border-radius: 0.25rem 0.25rem 0 0;

      .param {
        .circle-icon {
          opacity: 0.25;
        }
      }
    }
  }

  .param {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: paramin 0.4s @easeInOutExpo 0s 1 forwards;
    opacity: 0;
    border-left: 1px solid var(--bg2);
    background: var(--bg3);

    &:first-child {
      border-left: 0;
    }

    transform: translateY(-2rem);

    @keyframes paramin {
      100% {
        opacity: 1;
        transform: translateX(0rem);
      }
    }

    &:hover {
      .circle-icon {
        opacity: 1 !important;
      }
    }

    .circle-icon {
      width: 1rem !important;
      height: 1rem !important;
      display: inline-block;
      padding: 0;
      margin: 0;

      :deep(svg) {
        width: 100% !important;
        height: 100% !important;
        display: block;
      }

      &.closed-icon {
        color: var(--g1);
      }

      &.partial-icon {
        color: var(--g2);
      }

      &.open-icon {
        color: var(--g3);
      }
    }
  }

  .param-info {
    position: relative;
    // top: calc(1.5rem + 1px);
    // left: 0;
    padding: 1rem 1.5rem 2rem;
    background: var(--bg3);
    border-radius: 0 0 0.25rem 0.25rem;
    font-size: 0.75rem;
    width: 100%;

    .name {
      font-weight: 600;
      margin-bottom: 0.25em;

      > div {
        display: inline;
        margin-right: 0.5rem;
      }

      .param-name {
      }

      .reference {
        // position: absolute;
        // right: 0;
        // top: 0;
        padding: 0;
        margin: 0;
        color: var(--fg2);

        :deep(svg) {
          margin: 0;
          vertical-align: baseline;
        }

        &:hover {
          background: transparent;
          color: var(--link);
        }
      }
    }

    .param-notes {
      color: var(--fg2);
      max-width: 30em;
    }

    .links {
      padding-top: 0.5rem;
      color: var(--fg2);
      font-size: 0.75em;

      a {
        display: block;
      }
    }
  }
}

each(range(1, 30, 1), {
  .param:nth-child(@{value}) {
    animation-delay: @value * 0.02s;
  }
});
</style>
