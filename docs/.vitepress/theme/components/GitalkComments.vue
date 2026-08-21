<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vitepress";
import Gitalk from 'gitalk';
import 'gitalk/dist/gitalk.css';

const route = useRoute();
const container = ref<HTMLElement>();
const error = ref("");

onMounted(async () => {
  if (!container.value) {
    return;
  }

  try {
    if (!Gitalk) {
      throw new Error("Gitalk 未加载");
    }

    new Gitalk({
      clientID: "9b16ded173ee4fa97e7a",
      clientSecret: "647586aeb30a27e714482aec08a9de9046bfd536",
      repo: "VS-Code-Extension-Doc-ZH",
      owner: "Liiked",
      admin: ["Liiked"],
      pagerDirection: "last", // 'first' or 'last'
      // facebook-like distraction free mode
      distractionFreeMode: false,
      id: route.path.slice(0, 50),
    }).render(container.value);
  } catch (e) {
    console.error("Gitalk 初始化失败", e);
    error.value = "评论加载失败，请稍后重试。";
  }
});

</script>

<template>
  <section class="gitalk-comments" aria-label="评论">
    <p v-if="error" class="gitalk-error">{{ error }}</p>
    <div ref="container" />
  </section>
</template>