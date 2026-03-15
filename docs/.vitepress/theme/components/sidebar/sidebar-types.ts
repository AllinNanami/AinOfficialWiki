export interface SidebarSourceItem {
  text?: string
  link?: string
  items?: SidebarSourceItem[]
}

export interface SidebarNavNode {
  key: string
  text: string
  href?: string
  items: SidebarNavNode[]
  isFolder: boolean
  isActive: boolean
  isActiveTrail: boolean
  isOverview: boolean
}

export interface SidebarBrowserPage {
  key: string
  title: string
  nodes: SidebarNavNode[]
  parentKey?: string
}
