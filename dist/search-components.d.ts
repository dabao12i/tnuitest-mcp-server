import { embeddedComponents, embeddedDocs, EmbeddedComponent } from './embedded-docs';
export interface NormalizedSearchQuery {
    raw: string;
    normalized: string;
    tokens: string[];
    aliasTokens: string[];
    sceneTokens: string[];
}
export interface SearchComponentResult {
    component: EmbeddedComponent;
    reasons: string[];
    score: number;
    snippets: string[];
}
declare const ALIAS_MAP: Record<string, string[]>;
declare const SCENE_MAP: Record<string, string[]>;
declare const SCENE_COMPONENTS: Record<string, string[]>;
export declare function normalizeSearchQuery(rawQuery: string): NormalizedSearchQuery;
export declare function searchComponents(query: string, category?: string): SearchComponentResult[];
export declare function formatSearchResults(results: SearchComponentResult[], query: string): string;
export { ALIAS_MAP, SCENE_MAP, SCENE_COMPONENTS, embeddedComponents, embeddedDocs, EmbeddedComponent, };
//# sourceMappingURL=search-components.d.ts.map