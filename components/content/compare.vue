<template>
  <div class="compare">
    <!-- <div @click="rand = Math.random()">{{ rand }}</div> -->
    <div class="categories">
      <div class="frame">
        <div class="category" v-for="category in categories">
          <div class="cat-name">{{ category.name }}</div>
          <div class="params">
            <div class="param" v-for="param in category.params">
              {{ param.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="projectlist">
      <div class="project" v-for="item in models" :key="item.path">
        <div class="info">
          <NuxtLink
            :to="`/model/${item.filename}`"
            class="org"
            v-if="item?.org?.name"
            >{{ item.org.name }}</NuxtLink
          >
          <NuxtLink
            :to="`/model/${item.filename}`"
            class="name"
            v-if="item?.system?.name"
            >{{ item.system.name || "(undefined)" }}
          </NuxtLink>
        </div>
        <div class="data">
          <div class="category" v-for="category in categories">
            <!-- <div class="cat-name">{{ category }}</div> -->
            <div class="params">
              <div class="param" v-for="param in category.params">
                <div class="param-name">{{ param.name }}</div>
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
                <!-- <div class="hover">
                  <div class="param-hover-name">{{ param.name }}</div>
                  <div class='notes' v-html="item[param.ref].notes">
                  </div>
                  <NuxtLink :to="item[param.ref].link">{{ item[param.ref].link }}</NuxtLink>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import openIcon from "@/assets/icons/open.svg?raw";
import closedIcon from "@/assets/icons/closed.svg?raw";
import partialIcon from "@/assets/icons/partial.svg?raw";

const { models, categories, sortModels } = useModels();
</script>

<style scoped>
:root {
  --namesize: 14rem;
}

.projectlist {
}
.projectlist .project {
  display: flex;
  border-top: 1px solid var(--bc);
  padding: 0;
}
.projectlist .project .info {
  width: var(--namesize);
  min-width: var(--namesize);
  padding-bottom: 0.5rem;
}
.projectlist .project .data {
  flex: 1;
}
.projectlist .project .org {
  display: block;
  text-decoration: none;
  padding-top: 0.5rem;
  max-width: calc(100% - 1rem);
  line-height: 1.2;
}
.projectlist .project .name {
  font-size: 0.75rem;
  text-decoration: none;
}

.categories {
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  margin-bottom: 0;
  padding-top: 0;
  transition: all 0.2s ease;
}
.scroll-up.nottop .categories {
  top: 3rem;
}
.nottop .categories {
  box-shadow: 0 0 0.5rem var(--shadow);
}
.categories .frame {
  width: calc(100% - var(--namesize));
  margin-left: var(--namesize);
  display: flex;
  gap: 2rem;
  background: var(--bg);
  padding-bottom: 0.5rem;
  padding-top: 1rem;
  overflow: visible;
}
.categories .frame .category {
  background: var(--bg);
  font-weight: 600;
}
.categories .frame .cat-name {
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
}
.categories .frame .cat-name:after {
  content: "";
  position: absolute;
  top: 100%;
  width: 100%;
  height: 0.5rem;
  left: -3px;
  border: 1px solid var(--bc);
  border-width: 1px 3px 0 3px;
  box-sizing: content-box;
}
.categories .frame .params {
  display: flex;
  font-size: 0.6rem;
  gap: 0;
}
.categories .frame .params .param {
  white-space: nowrap;
  width: 4rem;
  text-align: center;
}

.data {
  display: flex;
  gap: 2rem;
}
.data .params {
  display: flex;
  gap: 0;
}
.data .params .param {
  position: relative;
  cursor: pointer;
  overflow: visible;
  padding: 0.5rem 0;
  width: 4rem;
  flex: 1;
}
.data .params .param .param-name {
  position: absolute;
  font-size: 0.6rem;
  line-height: 1em;
  opacity: 0;
}
.data .params .param .circle-icon {
  width: 2rem;
  height: 2rem;
  margin: 0 auto;
}
.data .params .param .circle-icon :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
.data .params .param .circle-icon.closed-icon {
  color: var(--g1);
}
.data .params .param .circle-icon.partial-icon {
  color: var(--g2);
}
.data .params .param .circle-icon.open-icon {
  color: var(--g3);
}
.data .params .param .hover {
  position: absolute;
  top: 100%;
  left: 0;
  width: 20rem;
  opacity: 0;
  pointer-events: none;
  background: var(--bg);
  font-size: 0.75rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 0 0.5rem var(--shadow);
  line-height: 1.4em;
}
.data .params .param .hover .param-hover-name {
  font-size: 0.6rem;
  font-weight: 800;
}
.data .params .param:hover {
  z-index: 9;
}
.data .params .param:hover .hover {
  opacity: 1;
  pointer-events: auto;
}

.param {
  width: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
