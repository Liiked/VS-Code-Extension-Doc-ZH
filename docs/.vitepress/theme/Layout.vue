<script setup lang="ts">
import { onMounted } from "vue";
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import GitalkComments from "./components/GitalkComments.vue";
import OriginalDocumentLink from "./components/OriginalDocumentLink.vue";

const { page } = useData();

onMounted(() => {
  const legacyRoute = window.location.hash;
  if (!legacyRoute.startsWith("#/")) {
    return;
  }

  const [legacyPath, query] = legacyRoute.slice(1).split("?");
  const targetPath = legacyPath
    .replace(/\/README(?:\.md)?$/i, "/")
    .replace(/\.md$/i, "");
  const fragment = new URLSearchParams(query).get("id");
  const target = `${import.meta.env.BASE_URL.replace(/\/$/, "")}${targetPath}${
    fragment ? `#${encodeURIComponent(fragment)}` : ""
  }`;

  window.location.replace(target);
});
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <OriginalDocumentLink :relative-path="page.relativePath" />
    </template>
    <template #doc-after>
      <GitalkComments />
    </template>
  </DefaultTheme.Layout>
</template>