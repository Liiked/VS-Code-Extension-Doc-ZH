<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vitepress";

const route = useRoute();
const container = ref<HTMLElement>();
const error = ref("");

const clientId = import.meta.env.VITE_GITALK_CLIENT_ID;
const clientSecret = import.meta.env.VITE_GITALK_CLIENT_SECRET;
const repository = import.meta.env.VITE_GITALK_REPOSITORY;
const owner = import.meta.env.VITE_GITALK_OWNER;
const admin = import.meta.env.VITE_GITALK_ADMIN?.split(",").filter(Boolean);

onMounted(async () => {
  if (!container.value || !clientId || !clientSecret || !repository || !owner || !admin?.length) {
    return;
  }

  try {
    await Promise.all([
      loadStyle("https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css"),
      loadScript("https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"),
    ]);

    const Gitalk = window.Gitalk;
    if (!Gitalk) {
      throw new Error("Gitalk 未加载");
    }

    new Gitalk({
      clientID: clientId,
      clientSecret,
      repo: repository,
      owner,
      admin,
      id: route.path.slice(0, 50),
    }).render(container.value);
  } catch {
    error.value = "评论加载失败，请稍后重试。";
  }
});

function loadScript(source: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("脚本加载失败"));
    document.head.append(script);
  });
}

function loadStyle(source: string) {
  return new Promise<void>((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = source;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error("样式加载失败"));
    document.head.append(link);
  });
}
</script>

<template>
  <section v-if="clientId" class="gitalk-comments" aria-label="评论">
    <p v-if="error" class="gitalk-error">{{ error }}</p>
    <div ref="container" />
  </section>
</template>