export interface PageTemplate {
    id: string;
    name: string;
    nameZh: string;
    description: string;
    category: string;
    components: ComponentUsage[];
    typicalUseCase: string;
}
export interface ComponentUsage {
    component: string;
    role: string;
    roleZh: string;
    required: boolean;
    notes?: string;
}
export interface PageTypeRecommendation {
    pageType: string;
    pageTypeZh: string;
    confidence: number;
    matchedComponents: string[];
    suggestedCode: string;
}
export declare const pageTemplates: PageTemplate[];
export declare const pageTypeKeywords: Record<string, string[]>;
export declare const componentRoles: Record<string, {
    role: string;
    roleZh: string;
    common: string[];
}>;
export declare function detectPageType(description: string): {
    type: string;
    confidence: number;
};
export declare function getPageTemplate(pageType: string): PageTemplate | undefined;
export declare function generatePageCode(template: PageTemplate): string;
//# sourceMappingURL=page-templates.d.ts.map