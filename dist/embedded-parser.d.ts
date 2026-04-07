export interface TNUIComponent {
    name: string;
    category: string;
    description: string;
    content?: string;
}
export interface TNUIResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    content: string;
}
export declare class EmbeddedDocParser {
    private componentIndex;
    private docsByUri;
    private initialized;
    constructor();
    private initialize;
    parseComponentIndex(): Promise<TNUIComponent[]>;
    getComponentDoc(componentName: string): Promise<string | null>;
    getAllComponents(): Promise<TNUIComponent[]>;
    searchComponents(query: string, category?: string): Promise<TNUIComponent[]>;
    getResources(): Promise<TNUIResource[]>;
}
//# sourceMappingURL=embedded-parser.d.ts.map