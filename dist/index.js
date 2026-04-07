"use strict";
/**
 * TNUI MCP Server - Enterprise-grade MCP Server for TNUI Component Library
 *
 * This server provides AI assistants with access to TNUI (图鸟UI) component documentation,
 * page generation, and style recommendations for uniapp + Vue3 development.
 *
 * @module @tuniao/tnui-mcp-server
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TNUIMCPServer = void 0;
exports.createToolSchema = createToolSchema;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
const embedded_docs_1 = require("./embedded-docs");
const page_templates_1 = require("./page-templates");
const style_system_1 = require("./style-system");
const search_components_1 = require("./search-components");
function createToolPropertySchema(schema) {
    if (schema instanceof zod_1.z.ZodOptional) {
        return createToolPropertySchema(schema.unwrap());
    }
    if (schema instanceof zod_1.z.ZodString) {
        return {
            type: 'string',
            description: schema.description || '',
        };
    }
    if (schema instanceof zod_1.z.ZodEnum) {
        return {
            type: 'string',
            enum: schema.options,
            description: schema.description || '',
        };
    }
    if (schema instanceof zod_1.z.ZodArray) {
        return {
            type: 'array',
            items: createToolPropertySchema(schema.element),
            description: schema.description || '',
        };
    }
    return {
        type: 'string',
        description: schema.description || '',
    };
}
function createToolSchema(inputSchema) {
    const shape = inputSchema.shape;
    return {
        type: 'object',
        properties: Object.fromEntries(Object.entries(shape).map(([key, schema]) => {
            const definition = schema;
            return [key, createToolPropertySchema(definition)];
        })),
        required: Object.entries(shape)
            .filter(([, schema]) => !schema.isOptional())
            .map(([key]) => key),
    };
}
// ============================================
// Server Implementation
// ============================================
class TNUIMCPServer {
    server;
    resources = new Map();
    tools = new Map();
    constructor(config) {
        this.server = new index_js_1.Server({
            name: config.name,
            version: config.version,
        }, {
            capabilities: {
                resources: {},
                tools: {},
            },
        });
        this.setupResources();
        this.setupTools();
        this.setupHandlers();
    }
    /**
     * Initialize server resources from embedded data
     */
    setupResources() {
        // Add component index
        this.resources.set('tuniao://tnui/components', {
            uri: 'tuniao://tnui/components',
            name: 'TNUI Component Index',
            description: 'Complete index of all TNUI (图鸟UI) components organized by category. Use this resource when: 1) User wants to see all available components 2) User needs to browse components by category 3) User asks "有哪些组件", "所有组件列表", "component list"',
            mimeType: 'text/markdown',
            content: embedded_docs_1.componentIndexContent,
        });
        // Add individual component docs
        for (const doc of embedded_docs_1.embeddedDocs) {
            if (doc.uri.includes('components/') &&
                !doc.uri.includes('component-index')) {
                const componentName = doc.uri.split('/').pop() || '';
                const component = embedded_docs_1.embeddedComponents.find((c) => c.name === componentName);
                if (component) {
                    this.resources.set(doc.uri, {
                        ...doc,
                        description: `${componentName} component for ${component.category} - ${doc.description}. Use this resource when: 1) User needs detailed documentation for ${componentName} component 2) User asks about ${componentName} props, events, slots 3) User wants usage examples`,
                    });
                }
            }
        }
        // Add overview
        const overviewDoc = embedded_docs_1.embeddedDocs.find((d) => d.uri === 'tuniao://tnui/overview');
        if (overviewDoc) {
            this.resources.set('tuniao://tnui/overview', {
                ...overviewDoc,
                description: 'TNUI library overview and architecture. Use this resource when: 1) User asks about TNUI structure or architecture 2) User needs to understand TNUI core concepts',
            });
        }
        // Add maintenance guide
        const maintenanceDoc = embedded_docs_1.embeddedDocs.find((d) => d.uri === 'tuniao://tnui/maintenance');
        if (maintenanceDoc) {
            this.resources.set('tuniao://tnui/maintenance', {
                ...maintenanceDoc,
                description: 'TNUI documentation maintenance guidelines. Use this resource when: 1) User needs to update or maintain TNUI documentation 2) User asks about documentation standards',
            });
        }
        // Add page templates
        this.resources.set('tuniao://tnui/page-templates', {
            uri: 'tuniao://tnui/page-templates',
            name: 'TNUI Page Templates',
            description: 'Pre-built uniapp page templates with recommended TNUI components for common page types',
            mimeType: 'application/json',
            content: JSON.stringify(page_templates_1.pageTemplates, null, 2),
        });
        // Add style system
        this.resources.set('tuniao://tnui/styles', {
            uri: 'tuniao://tnui/styles',
            name: 'TNUI Style System',
            description: 'TNUI component style variants, color themes, and design tokens',
            mimeType: 'application/json',
            content: JSON.stringify({
                componentStyles: style_system_1.componentStyles.map((cs) => ({
                    component: cs.component,
                    variants: cs.variants.map((v) => ({
                        variant: v.variant,
                        variantZh: v.variantZh,
                        description: v.description,
                        props: v.props,
                    })),
                })),
                colorThemes: style_system_1.colorThemes,
                borderRadius: style_system_1.borderRadius,
                sizePresets: style_system_1.sizePresets,
            }, null, 2),
        });
    }
    /**
     * Setup server tools
     */
    setupTools() {
        // Tool 1: search_components
        this.tools.set('search_components', {
            name: 'search_components',
            description: 'Search TNUI (图鸟UI) components by keyword or description. Use this tool when: 1) User mentions specific component types (button, form, popup, etc.) 2) User asks for UI component recommendations 3) User needs to find components for specific use cases (navigation, forms, feedback, etc.) 4) User mentions "TNUI", "图鸟", "组件选择", "UI组件"',
            inputSchema: zod_1.z.object({
                query: zod_1.z
                    .string()
                    .describe('Search keywords in Chinese or English: component names, functionality, or use cases'),
                category: zod_1.z
                    .string()
                    .optional()
                    .describe('Filter by component category: action-and-trigger, form-and-input, navigation-and-selection, data-display-and-status, layout-and-utility-oriented'),
            }),
            handler: async (args) => {
                const results = (0, search_components_1.searchComponents)(args.query, args.category);
                const content = (0, search_components_1.formatSearchResults)(results, args.query);
                return {
                    content: [{ type: 'text', text: content }],
                };
            },
        });
        // Tool 2: generate_page
        this.tools.set('generate_page', {
            name: 'generate_page',
            description: 'Generate uniapp page code using TNUI components. Use this tool when: 1) User wants to create a new page 2) User asks "做一个页面", "创建页面", "帮我写页面" 3) User describes a page type',
            inputSchema: zod_1.z.object({
                pageType: zod_1.z
                    .string()
                    .optional()
                    .describe('Type of page: login, register, home, list, detail, form, user-profile, chat, settings, cart'),
                pageDescription: zod_1.z
                    .string()
                    .describe('Natural language description of the page'),
                includeComponents: zod_1.z
                    .array(zod_1.z.string())
                    .optional()
                    .describe('Specific components to include'),
                stylePreferences: zod_1.z
                    .string()
                    .optional()
                    .describe('Style preferences like color, theme, effects'),
            }),
            handler: async (args) => {
                // Detect page type from description
                const detected = (0, page_templates_1.detectPageType)(args.pageDescription);
                const pageType = args.pageType || detected.type;
                const template = (0, page_templates_1.getPageTemplate)(pageType);
                if (!template) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `暂不支持 "${pageType}" 页面类型。\n\n支持的页面类型: login, register, home, list, detail, form, user-profile, chat, settings, cart`,
                            },
                        ],
                    };
                }
                // Generate code with style preferences
                let code = (0, page_templates_1.generatePageCode)(template);
                // Apply style preferences if provided
                if (args.stylePreferences) {
                    const styles = (0, style_system_1.detectStyles)(args.stylePreferences);
                    if (styles.includes('primary')) {
                        code = code.replace(/type="primary"/g, 'type="primary"');
                    }
                    else if (styles.includes('danger')) {
                        code = code.replace(/type="primary"/g, 'type="danger"');
                    }
                }
                let response = `## ${template.nameZh} (${template.name})\n\n`;
                response += `**典型场景**: ${template.typicalUseCase}\n\n`;
                response += `**检测置信度**: ${Math.round(detected.confidence * 100)}%\n\n`;
                response += `### 推荐的 TNUI 组件\n\n`;
                for (const usage of template.components) {
                    const requiredMark = usage.required ? '✓ 必需' : '○ 可选';
                    response += `- \`${usage.component}\`: ${usage.roleZh} ${requiredMark}`;
                    if (usage.notes)
                        response += ` (${usage.notes})`;
                    response += '\n';
                }
                response += `\n### 生成的代码\n\n`;
                response += '```vue\n' + code + '\n```\n';
                response += `\n### 使用说明\n\n`;
                response += `1. 将代码保存到 \`src/pages/${pageType}/index.vue\`\n`;
                response += `2. 在 \`pages.json\` 中添加页面路由\n`;
                response += `3. 根据需要调整组件属性\n`;
                return { content: [{ type: 'text', text: response }] };
            },
        });
        // Tool 3: get_style_recommendation
        this.tools.set('get_style_recommendation', {
            name: 'get_style_recommendation',
            description: 'Get TNUI component style recommendations. Use this tool when: 1) User asks about component styles or variants 2) User wants to customize component appearance 3) User mentions style keywords',
            inputSchema: zod_1.z.object({
                component: zod_1.z
                    .string()
                    .describe('TNUI component name: tn-button, tn-input, tn-list, etc.'),
                description: zod_1.z
                    .string()
                    .optional()
                    .describe('Style requirements in natural language'),
            }),
            handler: async (args) => {
                const styles = style_system_1.componentStyles.find((s) => s.component === args.component);
                if (!styles) {
                    let content = `暂不支持 "${args.component}" 的样式推荐。\n\n`;
                    content += `支持的组件:\n`;
                    for (const s of style_system_1.componentStyles) {
                        content += `- **${s.component}**: ${s.variants.length} 种样式\n`;
                    }
                    return { content: [{ type: 'text', text: content }] };
                }
                const detected = args.description ? (0, style_system_1.detectStyles)(args.description) : [];
                const recommendations = (0, style_system_1.getStyleRecommendation)(args.component, args.description || '');
                let content = `## ${args.component} 样式推荐\n\n`;
                if (detected.length > 0) {
                    content += `### 检测到的风格\n\n`;
                    content += detected.map((s) => `- ${s}`).join('\n') + '\n\n';
                }
                content += `### 可用的样式变体\n\n`;
                for (const variant of styles.variants) {
                    const isRecommended = recommendations.some((r) => r.variant === variant.variant);
                    const mark = isRecommended ? ' ✓' : '';
                    content += `#### ${variant.variantZh} (${variant.variant})${mark}\n`;
                    content += `${variant.description}\n`;
                    content += '```vue\n';
                    content += `<${args.component}`;
                    for (const [key, value] of Object.entries(variant.props)) {
                        if (typeof value === 'boolean') {
                            content += value ? ` ${key}` : '';
                        }
                        else {
                            content += ` ${key}="${value}"`;
                        }
                    }
                    content += ' />\n```\n\n';
                }
                content += `### 主题色\n\n`;
                for (const [theme, colors] of Object.entries(style_system_1.colorThemes)) {
                    content += `**${theme}**: ${colors.primary}\n`;
                }
                return { content: [{ type: 'text', text: content }] };
            },
        });
        // Tool 4: get_component_docs
        this.tools.set('get_component_docs', {
            name: 'get_component_docs',
            description: 'Get detailed documentation for a specific TNUI component. Use this tool when: 1) User asks for component details 2) User wants to know props, events, slots 3) User mentions specific component name',
            inputSchema: zod_1.z.object({
                component: zod_1.z
                    .string()
                    .describe('Component name without tn- prefix: button, input, form, etc.'),
                section: zod_1.z
                    .enum(['overview', 'props', 'events', 'slots', 'methods', 'all'])
                    .optional()
                    .describe('Specific section to retrieve'),
            }),
            handler: async (args) => {
                const componentName = args.component.toLowerCase();
                const doc = embedded_docs_1.embeddedDocs.find((d) => d.uri === `tuniao://tnui/components/${componentName}` ||
                    d.name === componentName);
                if (!doc) {
                    // Try partial match
                    const partialMatch = embedded_docs_1.embeddedDocs.find((d) => d.uri.includes(`/${componentName}`) ||
                        d.name.includes(componentName));
                    if (partialMatch) {
                        return { content: [{ type: 'text', text: partialMatch.content }] };
                    }
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `未找到 "${args.component}" 组件的文档。\n\n请尝试: button, input, form, modal, popup, tabs, list, switch, checkbox, radio, swiper 等`,
                            },
                        ],
                    };
                }
                let content = doc.content;
                // Filter by section if requested (future enhancement)
                if (args.section && args.section !== 'all') {
                    const sectionPatterns = {
                        overview: ['# ', '## '],
                        props: ['## 属性', '## Props', '### props', '### Props'],
                        events: ['## 事件', '## Events', '### events', '### Events'],
                        slots: ['## 插槽', '## Slots', '### slots', '### Slots'],
                        methods: ['## 方法', '## Methods', '### methods', '### Methods'],
                    };
                    const patterns = sectionPatterns[args.section];
                    if (patterns) {
                        content = doc.content;
                    }
                }
                return { content: [{ type: 'text', text: content }] };
            },
        });
        // Tool 5: list_components
        this.tools.set('list_components', {
            name: 'list_components',
            description: 'List all available TNUI components. Use this tool when: 1) User asks to list all components 2) User wants to see available components 3) User asks "有哪些组件", "component list"',
            inputSchema: zod_1.z.object({
                category: zod_1.z
                    .string()
                    .optional()
                    .describe('Filter by category: action-and-trigger, form-and-input, navigation-and-selection, data-display-and-status, layout-and-utility-oriented'),
                format: zod_1.z
                    .enum(['summary', 'detailed'])
                    .optional()
                    .describe('Output format'),
            }),
            handler: async (args) => {
                let components = embedded_docs_1.embeddedComponents;
                if (args.category) {
                    components = components.filter((c) => c.category === args.category);
                }
                let content = `## TNUI 组件列表\n\n`;
                content += `共 ${components.length} 个组件\n\n`;
                if (args.format === 'detailed') {
                    for (const comp of components) {
                        content += `### ${comp.name}\n`;
                        content += `- 分类: ${comp.category}\n`;
                        content += `- 描述: ${comp.description}\n\n`;
                    }
                }
                else {
                    // Group by category
                    const grouped = {};
                    for (const comp of components) {
                        if (!grouped[comp.category]) {
                            grouped[comp.category] = [];
                        }
                        grouped[comp.category].push(comp);
                    }
                    for (const [category, comps] of Object.entries(grouped)) {
                        content += `### ${category}\n`;
                        content +=
                            comps.map((c) => `- ${c.name}: ${c.description}`).join('\n') +
                                '\n\n';
                    }
                }
                return { content: [{ type: 'text', text: content }] };
            },
        });
    }
    /**
     * Setup MCP protocol handlers
     */
    setupHandlers() {
        // List resources handler
        this.server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
            const resources = Array.from(this.resources.values()).map((r) => ({
                uri: r.uri,
                name: r.name,
                description: r.description,
                mimeType: r.mimeType,
            }));
            return { resources };
        });
        // Read resource handler
        this.server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
            const uri = request.params.uri;
            const resource = this.resources.get(uri);
            if (!resource) {
                throw new Error(`Resource not found: ${uri}`);
            }
            return {
                contents: [
                    {
                        uri: resource.uri,
                        mimeType: resource.mimeType,
                        text: resource.content,
                    },
                ],
            };
        });
        // List tools handler
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            const tools = Array.from(this.tools.values()).map((tool) => ({
                name: tool.name,
                description: tool.description,
                inputSchema: createToolSchema(tool.inputSchema),
            }));
            return { tools };
        });
        // Call tool handler
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const toolName = request.params.name;
            const args = request.params.arguments || {};
            const tool = this.tools.get(toolName);
            if (!tool) {
                throw new Error(`Tool not found: ${toolName}`);
            }
            // Validate input
            const parsed = tool.inputSchema.parse(args);
            // Execute handler
            const result = await tool.handler(parsed);
            return result;
        });
    }
    /**
     * Start the server
     */
    async start() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('TNUI MCP Server started');
    }
}
exports.TNUIMCPServer = TNUIMCPServer;
// ============================================
// Main Entry Point
// ============================================
async function main() {
    const server = new TNUIMCPServer({
        name: 'tuniao-tnui-mcp-server',
        version: '1.0.0',
        port: 3000,
    });
    await server.start();
}
if (require.main === module) {
    main().catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map