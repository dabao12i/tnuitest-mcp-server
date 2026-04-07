import {
  embeddedDocs,
  embeddedComponents,
  componentIndexContent,
  EmbeddedDoc,
} from './embedded-docs'
import { pageTemplates } from './page-templates'
import {
  componentStyles,
  colorThemes,
  borderRadius,
  sizePresets,
} from './style-system'

export interface TNUIComponent {
  name: string
  category: string
  description: string
  content?: string
}

export interface TNUIResource {
  uri: string
  name: string
  description: string
  mimeType: string
  content: string
}

export class EmbeddedDocParser {
  private componentIndex: Map<string, TNUIComponent> = new Map()
  private docsByUri: Map<string, EmbeddedDoc> = new Map()
  private initialized = false

  constructor() {
    // Initialize docs map
    for (const doc of embeddedDocs) {
      this.docsByUri.set(doc.uri, doc)
    }

    // Initialize component index
    for (const component of embeddedComponents) {
      this.componentIndex.set(component.name, {
        name: component.name,
        category: component.category,
        description: component.description,
      })
    }
  }

  private async initialize() {
    if (this.initialized) return

    // Load component content
    for (const component of embeddedComponents) {
      const doc = this.docsByUri.get(
        `tuniao://tnui/components/${component.name}`
      )
      if (doc) {
        const comp = this.componentIndex.get(component.name)
        if (comp) {
          comp.content = doc.content
        }
      }
    }

    this.initialized = true
  }

  async parseComponentIndex(): Promise<TNUIComponent[]> {
    await this.initialize()
    return Array.from(this.componentIndex.values())
  }

  async getComponentDoc(componentName: string): Promise<string | null> {
    await this.initialize()
    const component = this.componentIndex.get(componentName)
    return component?.content || null
  }

  async getAllComponents(): Promise<TNUIComponent[]> {
    await this.initialize()
    return Array.from(this.componentIndex.values())
  }

  async searchComponents(
    query: string,
    category?: string
  ): Promise<TNUIComponent[]> {
    const components = await this.getAllComponents()
    const queryLower = query.toLowerCase()

    return components.filter((component) => {
      const matchesQuery =
        component.name.toLowerCase().includes(queryLower) ||
        component.description.toLowerCase().includes(queryLower) ||
        (component.content &&
          component.content.toLowerCase().includes(queryLower))

      const matchesCategory = !category || component.category === category

      return matchesQuery && matchesCategory
    })
  }

  async getResources(): Promise<TNUIResource[]> {
    await this.initialize()
    const resources: TNUIResource[] = []

    // Add component index resource
    resources.push({
      uri: 'tuniao://tnui/components',
      name: 'TNUI Component Index',
      description:
        'Complete index of all TNUI (图鸟UI) components organized by category. Use this resource when: 1) User wants to see all available components 2) User needs to browse components by category 3) User asks "有哪些组件", "所有组件列表", "component list" 4) When comparing similar components across categories',
      mimeType: 'text/markdown',
      content: componentIndexContent,
    })

    // Add individual component resources
    for (const component of embeddedComponents) {
      const doc = this.docsByUri.get(
        `tuniao://tnui/components/${component.name}`
      )
      if (doc) {
        // Create detailed description for each component
        const detailedDescription = `${component.name} component for ${component.category} - ${doc.description}. Use this resource when: 1) User needs detailed documentation for ${component.name} component 2) User asks about ${component.name} props, events, slots 3) User wants usage examples for ${component.name} 4) User mentions "${component.name}怎么用", "${component.name}文档", "${component.name}属性"`

        resources.push({
          uri: doc.uri,
          name: doc.name,
          description: detailedDescription,
          mimeType: doc.mimeType,
          content: doc.content,
        })
      }
    }

    // Add overview resource
    const overviewDoc = this.docsByUri.get('tuniao://tnui/overview')
    if (overviewDoc) {
      resources.push({
        uri: overviewDoc.uri,
        name: overviewDoc.name,
        description:
          'TNUI library overview and architecture. Use this resource when: 1) User asks about TNUI structure or architecture 2) User needs to understand TNUI core concepts 3) User mentions "TNUI架构", "组件库结构", "library overview" 4) When user needs general information about TNUI',
        mimeType: overviewDoc.mimeType,
        content: overviewDoc.content,
      })
    }

    // Add maintenance resource
    const maintenanceDoc = this.docsByUri.get('tuniao://tnui/maintenance')
    if (maintenanceDoc) {
      resources.push({
        uri: maintenanceDoc.uri,
        name: maintenanceDoc.name,
        description:
          'TNUI documentation maintenance guidelines. Use this resource when: 1) User needs to update or maintain TNUI documentation 2) User asks about documentation standards 3) User mentions "文档维护", "documentation maintenance", "更新文档" 4) When working on TNUI library development or contribution',
        mimeType: maintenanceDoc.mimeType,
        content: maintenanceDoc.content,
      })
    }

    // Add page templates resource
    resources.push({
      uri: 'tuniao://tnui/page-templates',
      name: 'TNUI Page Templates',
      description:
        'Pre-built uniapp page templates with recommended TNUI components for common page types (login, register, home, list, detail, form, user-profile, chat, settings, cart). Use this resource when: 1) User wants to create a new page 2) User asks "做一个页面", "创建页面", "帮我写页面" 3) User needs page scaffolding or templates 4) User mentions any of these page types in Chinese or English',
      mimeType: 'application/json',
      content: JSON.stringify(pageTemplates, null, 2),
    })

    // Add style system resource
    resources.push({
      uri: 'tuniao://tnui/styles',
      name: 'TNUI Style System',
      description:
        'TNUI component style variants, color themes, and design tokens. Use this resource when: 1) User asks about component styles (风格, 样式, 变体) 2) User wants to customize appearance (颜色, 圆角, 大小) 3) User mentions style keywords (主要, 次要, 成功, 危险, 禁用, 动画) 4) User asks "按钮有哪些颜色", "如何圆角", "主题色配置"',
      mimeType: 'application/json',
      content: JSON.stringify(
        {
          componentStyles: componentStyles.map((cs) => ({
            component: cs.component,
            variants: cs.variants.map((v) => ({
              variant: v.variant,
              variantZh: v.variantZh,
              description: v.description,
              props: v.props,
            })),
          })),
          colorThemes,
          borderRadius,
          sizePresets,
        },
        null,
        2
      ),
    })

    return resources
  }
}
