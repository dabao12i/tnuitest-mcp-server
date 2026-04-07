import * as fs from 'fs'
import * as path from 'path'

export interface TNUIComponent {
  name: string
  category: string
  description: string
  docPath: string
  content?: string
}

export interface TNUIResource {
  uri: string
  name: string
  description: string
  mimeType: string
  content: string
}

export class TNUIDocParser {
  private docsRoot: string
  private componentIndex: Map<string, TNUIComponent> = new Map()

  constructor(docsRoot: string = 'llm-docs/tnui') {
    this.docsRoot = docsRoot
  }

  async parseComponentIndex(): Promise<TNUIComponent[]> {
    const indexPath = path.join(this.docsRoot, 'component-index.md')

    if (!fs.existsSync(indexPath)) {
      throw new Error(`Component index not found at ${indexPath}`)
    }

    const content = fs.readFileSync(indexPath, 'utf8')
    const components: TNUIComponent[] = []

    // Parse categories and components
    const categoryRegex = /## (.+?) Components\n\n([\s\S]*?)(?=\n## |$)/g
    let match

    while ((match = categoryRegex.exec(content)) !== null) {
      const category = match[1].toLowerCase().replace(/\s+/g, '-')
      const sectionContent = match[2]

      // Parse component lines
      const componentRegex =
        /- \[([^\]]+)\]\(\.\/components\/([^)]+)\.md\):\s*(.+)/g
      let componentMatch

      while ((componentMatch = componentRegex.exec(sectionContent)) !== null) {
        const name = componentMatch[1]
        const docFile = componentMatch[2]
        const description = componentMatch[3].trim()

        const component: TNUIComponent = {
          name,
          category,
          description,
          docPath: path.join(this.docsRoot, 'components', `${docFile}.md`),
        }

        components.push(component)
        this.componentIndex.set(name, component)
      }
    }

    return components
  }

  async getComponentDoc(componentName: string): Promise<string | null> {
    const component = this.componentIndex.get(componentName)

    if (!component) {
      return null
    }

    if (!fs.existsSync(component.docPath)) {
      return null
    }

    return fs.readFileSync(component.docPath, 'utf8')
  }

  async getAllComponents(): Promise<TNUIComponent[]> {
    if (this.componentIndex.size === 0) {
      await this.parseComponentIndex()
    }

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
        component.description.toLowerCase().includes(queryLower)

      const matchesCategory = !category || component.category === category

      return matchesQuery && matchesCategory
    })
  }

  async getResources(): Promise<TNUIResource[]> {
    const components = await this.getAllComponents()
    const resources: TNUIResource[] = []

    // Add component index resource
    const indexPath = path.join(this.docsRoot, 'component-index.md')
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8')
      resources.push({
        uri: 'tuniao://tnui/components',
        name: 'TNUI Component Index',
        description: 'Index of all TNUI components with categories',
        mimeType: 'text/markdown',
        content: indexContent,
      })
    }

    // Add individual component resources
    for (const component of components) {
      if (fs.existsSync(component.docPath)) {
        const content = fs.readFileSync(component.docPath, 'utf8')
        resources.push({
          uri: `tuniao://tnui/components/${component.name}`,
          name: `${component.name} Component`,
          description: component.description,
          mimeType: 'text/markdown',
          content,
        })
      }
    }

    // Add overview resource
    const overviewPath = path.join(this.docsRoot, 'overview.md')
    if (fs.existsSync(overviewPath)) {
      const overviewContent = fs.readFileSync(overviewPath, 'utf8')
      resources.push({
        uri: 'tuniao://tnui/overview',
        name: 'TNUI Overview',
        description: 'Overview and structure of the TNUI library',
        mimeType: 'text/markdown',
        content: overviewContent,
      })
    }

    // Add maintenance resource
    const maintenancePath = path.join(this.docsRoot, 'maintenance.md')
    if (fs.existsSync(maintenancePath)) {
      const maintenanceContent = fs.readFileSync(maintenancePath, 'utf8')
      resources.push({
        uri: 'tuniao://tnui/maintenance',
        name: 'TNUI Maintenance Guide',
        description: 'Guidelines for maintaining TNUI documentation',
        mimeType: 'text/markdown',
        content: maintenanceContent,
      })
    }

    return resources
  }
}
