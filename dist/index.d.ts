/**
 * TNUI MCP Server - Enterprise-grade MCP Server for TNUI Component Library
 *
 * This server provides AI assistants with access to TNUI (图鸟UI) component documentation,
 * page generation, and style recommendations for uniapp + Vue3 development.
 *
 * @module @tuniao/tnui-mcp-server
 * @version 1.0.0
 */
import { z } from 'zod';
interface ServerConfig {
    name: string;
    version: string;
    port: number;
}
interface ToolPropertySchema {
    type: 'string' | 'array';
    description: string;
    enum?: string[];
    items?: ToolPropertySchema;
}
declare function createToolSchema(inputSchema: z.ZodSchema<any>): {
    type: string;
    properties: {
        [k: string]: ToolPropertySchema;
    };
    required: string[];
};
declare class TNUIMCPServer {
    private server;
    private resources;
    private tools;
    constructor(config: ServerConfig);
    /**
     * Initialize server resources from embedded data
     */
    private setupResources;
    /**
     * Setup server tools
     */
    private setupTools;
    /**
     * Setup MCP protocol handlers
     */
    private setupHandlers;
    /**
     * Start the server
     */
    start(): Promise<void>;
}
export { TNUIMCPServer, createToolSchema };
//# sourceMappingURL=index.d.ts.map