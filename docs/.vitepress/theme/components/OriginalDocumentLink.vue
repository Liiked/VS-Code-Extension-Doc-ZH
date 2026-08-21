<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  relativePath: string;
}>();

const sourcePath = computed(() => {
  const path = props.relativePath
    .replace(/\\/g, "/")
    .replace(/(?:^|\/)index\.md$/, "")
    .replace(/\.md$/, "");

  return path ? `/${path}` : "/";
});

const originalDocumentUrl = computed(
  () => `https://code.visualstudio.com/api${sourcePath.value}`,
);
</script>

<template>
  <p class="original-document-link">
    <a :href="originalDocumentUrl" target="_blank" rel="noreferrer">
      查看英文原始文档
    </a>
  </p>
</template>