import typia from "typia";
export declare const params: (params: any) => Promise<typia.IValidation<{
    hello?: "world" | undefined;
    by?: (string & typia.tags.MinLength<2> & typia.tags.MaxLength<16>) | undefined;
}>>;
export declare const paramsSchema: {
    schemas: {
        type: string;
        properties: {
            data: {
                type: string;
                properties: {
                    hello: {
                        type: string;
                        enum: string[];
                    };
                    by: {
                        type: string;
                        maxLength: number;
                        minLength: number;
                    };
                };
                nullable: boolean;
            };
        };
        nullable: boolean;
        required: string[];
    }[];
    components: {
        schemas: {};
    };
    purpose: string;
    surplus: boolean;
};
