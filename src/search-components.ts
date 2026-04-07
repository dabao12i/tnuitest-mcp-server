import {
  embeddedComponents,
  embeddedDocs,
  EmbeddedComponent,
} from './embedded-docs'

export interface NormalizedSearchQuery {
  raw: string
  normalized: string
  tokens: string[]
  aliasTokens: string[]
  sceneTokens: string[]
}

export interface SearchComponentResult {
  component: EmbeddedComponent
  reasons: string[]
  score: number
  snippets: string[]
}

const ALIAS_MAP: Record<string, string[]> = {
  button: ['按钮', '按键', 'button'],
  input: ['输入框', '输入', 'input'],
  popup: ['弹窗', '弹出层', 'popup'],
  modal: ['模态框', '对话框', 'modal'],
  swiper: ['轮播', '轮播图', 'swiper'],
  'search-box': ['搜索框', '搜索', 'search'],
  form: ['表单', 'form'],
  list: ['列表', 'list'],
  tabs: ['标签页', '选项卡', 'tabs'],
}

const SCENE_MAP: Record<string, string[]> = {
  login: ['登录', 'login'],
  list: ['列表页', 'list'],
}

const SCENE_COMPONENTS: Record<string, string[]> = {
  login: ['form', 'input', 'button'],
  list: ['list', 'search-box', 'tabs'],
}

function collectMappedTokens(
  normalized: string,
  map: Record<string, string[]>
): string[] {
  if (!normalized) {
    return []
  }

  return Array.from(
    new Set(
      Object.entries(map)
        .filter(([, keywords]) =>
          keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
        )
        .map(([canonicalToken]) => canonicalToken)
    )
  )
}

function getDisplayName(component: EmbeddedComponent) {
  return component.name.startsWith('tn-') ? component.name : `tn-${component.name}`
}

export function normalizeSearchQuery(rawQuery: string): NormalizedSearchQuery {
  const normalized = rawQuery.trim().toLowerCase()
  const tokens = normalized ? [normalized] : []

  return {
    raw: rawQuery,
    normalized,
    tokens,
    aliasTokens: collectMappedTokens(normalized, ALIAS_MAP),
    sceneTokens: collectMappedTokens(normalized, SCENE_MAP),
  }
}

function matchDocSnippets(componentName: string, terms: string[]) {
  const matchedDoc = embeddedDocs.find((doc) =>
    doc.uri.endsWith(`/components/${componentName}`)
  )

  if (!matchedDoc) {
    return []
  }

  return terms
    .filter((term) => matchedDoc.content.toLowerCase().includes(term))
    .map((term) => `文档包含“${term}”`)
}

export function searchComponents(
  query: string,
  category?: string
): SearchComponentResult[] {
  const normalizedQuery = normalizeSearchQuery(query)
  const isDirectComponentQuery =
    normalizedQuery.aliasTokens.length > 0 ||
    embeddedComponents.some((component) => component.name === normalizedQuery.normalized)
  const sceneTokens = isDirectComponentQuery ? [] : normalizedQuery.sceneTokens
  const docTerms = normalizedQuery.tokens.filter(Boolean)

  const results = embeddedComponents
    .filter((component) => !category || component.category === category)
    .map((component) => {
      let score = 0
      const reasons: string[] = []

      if (
        normalizedQuery.tokens.some((token) => component.name.includes(token))
      ) {
        score += 100
        reasons.push('匹配组件名')
      }

      if (normalizedQuery.aliasTokens.includes(component.name)) {
        score += 80
        reasons.push('匹配组件别名')
      }

      const aliasKeywords = ALIAS_MAP[component.name] || []
      if (
        normalizedQuery.tokens.some((token) =>
          aliasKeywords.some((keyword) => keyword.toLowerCase() === token)
        )
      ) {
        score += 70
        if (!reasons.includes('匹配组件别名')) {
          reasons.push('匹配组件别名')
        }
      }

      if (
        sceneTokens.some((scene) =>
          (SCENE_COMPONENTS[scene] || []).includes(component.name)
        )
      ) {
        score += 60
        reasons.push('匹配页面场景')
      }

      if (
        normalizedQuery.tokens.some((token) =>
          component.description.toLowerCase().includes(token)
        )
      ) {
        score += 40
        reasons.push('匹配组件描述')
      }

      if (
        normalizedQuery.tokens.some((token) =>
          component.category.toLowerCase().includes(token)
        )
      ) {
        score += 20
        reasons.push('匹配组件分类')
      }

      const snippets =
        normalizedQuery.aliasTokens.includes(component.name) ||
        sceneTokens.some((scene) =>
          (SCENE_COMPONENTS[scene] || []).includes(component.name)
        )
          ? []
          : matchDocSnippets(component.name, docTerms)
      if (snippets.length > 0) {
        score += 10
        reasons.push('匹配文档内容')
      }

      return {
        component,
        reasons: Array.from(new Set(reasons)),
        score,
        snippets,
      }
    })
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.component.name.localeCompare(right.component.name)
    )

  return results
}

export function formatSearchResults(
  results: SearchComponentResult[],
  query: string
) {
  const normalizedQuery = query.trim()

  if (results.length === 0) {
    const title = normalizedQuery
      ? `未找到与“${normalizedQuery}”匹配的组件。`
      : '未找到匹配的组件。'

    return [title, '', '可以尝试：按钮 / 表单 / 弹窗 / 列表 / 轮播'].join(
      '\n'
    )
  }

  const lines = ['## 匹配的组件', '']

  for (const result of results.slice(0, 10)) {
    lines.push(
      `- **${getDisplayName(result.component)}** (${result.component.category}): ${result.component.description}`
    )
    lines.push(`  - 推荐原因：${result.reasons.join('、')}`)
  }

  return lines.join('\n')
}

export {
  ALIAS_MAP,
  SCENE_MAP,
  SCENE_COMPONENTS,
  embeddedComponents,
  embeddedDocs,
  EmbeddedComponent,
}
