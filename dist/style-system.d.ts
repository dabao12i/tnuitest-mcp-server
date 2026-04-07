export interface StyleTheme {
    id: string;
    name: string;
    nameZh: string;
    description: string;
    colors: ColorScheme;
    borderRadius: string;
    shadows: ShadowConfig;
}
export interface ColorScheme {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    default: string;
    text: string;
    textDisabled: string;
    bgColor: string;
    bgColorSecondary: string;
    borderColor: string;
}
export interface ShadowConfig {
    small: string;
    medium: string;
    large: string;
}
export interface ComponentStyle {
    component: string;
    variants: StyleVariant[];
}
export interface StyleVariant {
    variant: string;
    variantZh: string;
    description: string;
    props: Record<string, any>;
}
export declare const colorThemes: Record<string, ColorScheme>;
export declare const componentStyles: ComponentStyle[];
export declare const borderRadius: Record<string, {
    name: string;
    value: string;
}>;
export declare const sizePresets: Record<string, {
    name: string;
    height: string;
    fontSize: string;
}>;
export declare const styleKeywords: Record<string, string[]>;
export declare function detectStyles(description: string): string[];
export declare function getStyleRecommendation(component: string, description: string): StyleVariant[];
export declare function generateStyleProps(component: string, description: string): string;
//# sourceMappingURL=style-system.d.ts.map