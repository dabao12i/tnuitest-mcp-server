"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TNUIDocParser = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class TNUIDocParser {
    docsRoot;
    componentIndex = new Map();
    constructor(docsRoot = 'llm-docs/tnui') {
        this.docsRoot = docsRoot;
    }
    async parseComponentIndex() {
        const indexPath = path.join(this.docsRoot, 'component-index.md');
        if (!fs.existsSync(indexPath)) {
            throw new Error(`Component index not found at ${indexPath}`);
        }
        const content = fs.readFileSync(indexPath, 'utf8');
        const components = [];
        // Parse categories and components
        const categoryRegex = /## (.+?) Components\n\n([\s\S]*?)(?=\n## |$)/g;
        let match;
        while ((match = categoryRegex.exec(content)) !== null) {
            const category = match[1].toLowerCase().replace(/\s+/g, '-');
            const sectionContent = match[2];
            // Parse component lines
            const componentRegex = /- \[([^\]]+)\]\(\.\/components\/([^)]+)\.md\):\s*(.+)/g;
            let componentMatch;
            while ((componentMatch = componentRegex.exec(sectionContent)) !== null) {
                const name = componentMatch[1];
                const docFile = componentMatch[2];
                const description = componentMatch[3].trim();
                const component = {
                    name,
                    category,
                    description,
                    docPath: path.join(this.docsRoot, 'components', `${docFile}.md`),
                };
                components.push(component);
                this.componentIndex.set(name, component);
            }
        }
        return components;
    }
    async getComponentDoc(componentName) {
        const component = this.componentIndex.get(componentName);
        if (!component) {
            return null;
        }
        if (!fs.existsSync(component.docPath)) {
            return null;
        }
        return fs.readFileSync(component.docPath, 'utf8');
    }
    async getAllComponents() {
        if (this.componentIndex.size === 0) {
            await this.parseComponentIndex();
        }
        return Array.from(this.componentIndex.values());
    }
    async searchComponents(query, category) {
        const components = await this.getAllComponents();
        const queryLower = query.toLowerCase();
        return components.filter((component) => {
            const matchesQuery = component.name.toLowerCase().includes(queryLower) ||
                component.description.toLowerCase().includes(queryLower);
            const matchesCategory = !category || component.category === category;
            return matchesQuery && matchesCategory;
        });
    }
    async getResources() {
        const components = await this.getAllComponents();
        const resources = [];
        // Add component index resource
        const indexPath = path.join(this.docsRoot, 'component-index.md');
        if (fs.existsSync(indexPath)) {
            const indexContent = fs.readFileSync(indexPath, 'utf8');
            resources.push({
                uri: 'tuniao://tnui/components',
                name: 'TNUI Component Index',
                description: 'Index of all TNUI components with categories',
                mimeType: 'text/markdown',
                content: indexContent,
            });
        }
        // Add individual component resources
        for (const component of components) {
            if (fs.existsSync(component.docPath)) {
                const content = fs.readFileSync(component.docPath, 'utf8');
                resources.push({
                    uri: `tuniao://tnui/components/${component.name}`,
                    name: `${component.name} Component`,
                    description: component.description,
                    mimeType: 'text/markdown',
                    content,
                });
            }
        }
        // Add overview resource
        const overviewPath = path.join(this.docsRoot, 'overview.md');
        if (fs.existsSync(overviewPath)) {
            const overviewContent = fs.readFileSync(overviewPath, 'utf8');
            resources.push({
                uri: 'tuniao://tnui/overview',
                name: 'TNUI Overview',
                description: 'Overview and structure of the TNUI library',
                mimeType: 'text/markdown',
                content: overviewContent,
            });
        }
        // Add maintenance resource
        const maintenancePath = path.join(this.docsRoot, 'maintenance.md');
        if (fs.existsSync(maintenancePath)) {
            const maintenanceContent = fs.readFileSync(maintenancePath, 'utf8');
            resources.push({
                uri: 'tuniao://tnui/maintenance',
                name: 'TNUI Maintenance Guide',
                description: 'Guidelines for maintaining TNUI documentation',
                mimeType: 'text/markdown',
                content: maintenanceContent,
            });
        }
        return resources;
    }
}
exports.TNUIDocParser = TNUIDocParser;
//# sourceMappingURL=doc-parser.js.map