/** @jsx h */

import blog, { h } from "blog";

function SourceHutIcon() {
  return (
  <svg
  class="inline-block w-5 h-5"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle
    cx="10"
    cy="10"
    r="8"
    stroke="currentColor"
    stroke-width="2"
    fill="none"
  />
</svg>

);
}

function MoreIcon() {
return (
<svg
  class="inline-block w-5 h-5"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M5 10H15M10 5V15"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
);
}

blog({
  title: "ITY's Blog",
  description: "Share what interests me.",
  avatar: "avatar.png",
  avatarClass: "rounded-full",
  favicon: "favicon.ico",
  links: [
  { title: "Email", url: "mailto:admin@ity.moe" },
  { title: "SourceHut", url: "https://sr.ht/~ity", icon: <SourceHutIcon /> },
  { title: "Index", url: "https://ity.moe", icon: <MoreIcon />} ,
],
  footer: (
      <footer class="mt-20 pb-16 lt-sm:pb-8 lt-sm:mt-16">
      <p class="flex items-center gap-2.5 text-gray-400/800 dark:text-gray-500/800 text-sm">
        <a
          href="https://www.lilkon.cn/"
          class="inline-flex items-center hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          title="VinKon"
        >
	VinKon
	</a>
	<a
          class="inline-flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
	|
	</a>
        <a
          href="https://anillc.cn/"
          class="inline-flex items-center hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          title="Anillc"
        >
	Anillc
	</a>
	<a
          class="inline-flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
	|
	</a>
        <a
          href="/feed"
          class="inline-flex items-center hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          title="Atom Feed"
        >
              <svg
      class="inline-block w-4 h-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
      <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
    </svg> RSS
        </a>
      </p>
    </footer>
  ),
});
