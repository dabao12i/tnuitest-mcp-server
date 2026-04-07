export interface TNUIComponent {
    name: string;
    category: string;
    description: string;
    docPath: string;
    content?: string;
}
export interface TNUIResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    content: string;
}
export declare class TNUIDocParser {
    private docsRoot;
    private componentIndex;
    constructor(docsRoot?: string);
    parseComponentIndex(): Promise<TNUIComponent[]>;
    getComponentDoc(componentName: string): Promise<string | null>;
    getAllComponents(): Promise<TNUIComponent[]>;
    searchComponents(query: string, category?: string): Promise<TNUIComponent[]>;
    getResources(): Promise<TNUIResource[]>;
}
//# sourceMappingURL=doc-parser.d.ts.map