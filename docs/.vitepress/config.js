module.exports = {
  title: 'Feathers-Pinia',
  description: 'Connect Feathers.',
  lang: 'en-US',
  themeConfig: {
    nav: [
      // { text: "Guide", link: "/", activeMatch: "^/$|^/guide/" },
      // {
      //   text: 'Config Reference',
      //   link: '/config/basics',
      //   activeMatch: '^/config/'
      // },
      {
        text: 'Release Notes',
        link: 'https://github.com/marshallswain/feathers-pinia/releases',
      },
    ],
    sidebar: {
      '/guide/': getGuideSidebar(),
      // "/config/": getConfigSidebar(),
      '/': getGuideSidebar(),
    },
  },
}

function getGuideSidebar() {
  return [
    {
      text: 'Guide',
      children: [
        { text: 'Introduction', link: '/guide/' },
        { text: 'Setup', link: '/guide/setup' },
        { text: 'Service Stores', link: '/guide/service-stores' },
        { text: 'Model Classes', link: '/guide/model-classes' },
        { text: 'Model Instances', link: '/guide/model-instances' },
        { text: 'Storage Sync', link: '/guide/storage-sync' },
      ],
    },
    {
      text: 'Advanced',
      children: [{ text: 'Frontmatter', link: '/guide/frontmatter' }],
    },
  ]
}
