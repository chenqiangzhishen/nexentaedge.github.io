const siteConfig = {
  title: 'Discover NexentaEdge',
  tagline: 'Your universal Scale-Out Storage Software with global Deduplication and Compression',
  url: 'https://nexentaedge.github.io',
  baseUrl: '/',
  projectName: 'nexentaedge.github.io', // or set an env variable PROJECT_NAME
  organizationName: 'nexentaedge', // or set an env variable ORGANIZATION_NAME
  headerLinks: [{doc: 'introduction', label: 'Documentation'}, {blog: true, label: 'Blog'}],
  users: [
    //{
    //  caption: "Ericson",
    //  image: "/test-site/img/docusaurus.svg",
    //  infoLink: "https://www.facebook.com",
    //  pinned: true
    //}
  ],
  headerIcon: 'img/logo-nexenta-edge.png',
  footerIcon: 'img/logo-nexenta-edge.png',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: '#e86b00',
    secondaryColor: '#c6c6c6'
  },
  //fonts: {
  //  myFont: [
  //    "Open Sans",
  //    "-apple-system",
  //    "system-ui"
  //  ]
  //  myOtherFont: [
  //    "-apple-system",
  //    "system-ui"
  //  ]
  //},
  copyright: `Copyright © ${new Date().getFullYear()} Nexenta Systems`,
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default'
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/Nexenta/nedge-dev',
  stylesheets: ['/css/fonts.css']
};

module.exports = siteConfig;
