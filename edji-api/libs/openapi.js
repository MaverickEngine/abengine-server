const schema_description = require("./schema_description");
const fs = require("fs");
const path = require("path");
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, `../openapi/edji.json`), 'utf8'));

const type_map = (type) => {
    switch (type) {
        case "String":
            return "string";
        case "Number":
            return "number";
        case "Date":
            return "string";
        case "Boolean":
            return "boolean";
        case "Array":
            return "array";
        case "Object":
            return "object";
        case "ObjectId":
            return "string";
        case "Mixed":
            return "object";
        default:
            return "string";
    }
};

class OpenAPI {
    constructor(opts) {
        this.config = Object.assign({}, opts.config);
        this.models = opts.models;
    }

    responseSchemaComponent(model) {
        const ucname = model.charAt(0).toUpperCase() + model.slice(1);
        return {
            [`${ucname}Response`]: {
                type: "object",
                properties: {
                    data: {
                        type: "array",
                        items: {
                            $ref: `#/components/schemas/${ucname}`
                        }
                    },
                    count: {
                        type: "number"
                    }
                }
            }
        };
    }

    generateProperty(prop_name, schema) {
        const prop = schema.properties[prop_name];
        const type = type_map(schema.paths[prop_name].instance);
        const response = {
            type,
            default: prop.default,
            description: prop.description,
            index: prop.index,
            required: prop.required,
            unique: prop.unique,
            min: prop.min,
            max: prop.max,
        };
        if (prop.link) {
            response.$ref = `#/components/schemas/${prop.link}`;
        }
        return response;
    }

    postRequestSchemaComponent(schema) {
        const ignore = ["createdAt", "updatedAt", "deletedAt"];
        const ucname = schema.model.charAt(0).toUpperCase() + schema.model.slice(1);
        const request = {
            type: "object",
            properties: {}
        };
        for (let prop_name in schema.properties) {
            if (ignore.includes(prop_name)) continue;
            if (prop_name.startsWith("_")) continue;
            request.properties[prop_name] = this.generateProperty(prop_name, schema);
        }
        return {
            [`${ucname}PostRequest`]: request
        };
    }

    postResponseSchemaComponent(schema) {
        const ucname = schema.model.charAt(0).toUpperCase() + schema.model.slice(1);
        const request = {
            type: "object",
            properties: {
                "status": {
                    type: "string",
                    default: "ok"
                },
                "message": {
                    type: "string",
                    default: `${schema.model} created`
                },
                "data": {
                    type: "object",
                    properties: {}
                }
            }
        }
        for (let prop_name in schema.properties) {
            request.properties.data.properties[prop_name] = this.generateProperty(prop_name, schema);
        }
        return {
            [`${ucname}PostResponse`]: request
        };
    }

    deleteResponseSchemaComponent(schema) {
        const ucname = schema.model.charAt(0).toUpperCase() + schema.model.slice(1);
        const response = {
            type: "object",
            properties: {
                "status": {
                    type: "string",
                    default: "ok"
                },
                "message": {
                    type: "string",
                    default: `${schema.model}/{id} deleted`
                }
            }
        }
        return {
            [`${ucname}DeleteResponse`]: response
        };
    }


    async generate_spec() {
        const schemas = await schema_description(this.config.model_dir);
        for (let schema of schemas) {
            console.log({schema});
            const ucname = schema.model.charAt(0).toUpperCase() + schema.model.slice(1);
            const paths = {
                [`/api/${schema.model}`]: {
                    get: {
                        tags: [schema.model],
                        summary: `Get all ${schema.model}`,
                        operationId: `get${schema.model}`,
                        parameters: [
                            {
                                $ref: "#/components/parameters/limit"
                            },
                            {
                                $ref: "#/components/parameters/page"
                            }
                        ],
                        responses: {
                            200: {
                                description: `A list of ${schema.model}`,
                                content: {
                                    "application/json": {
                                        schema: {
                                            $ref: `#/components/schemas/${ucname}Response`
                                        }
                                    }
                                }
                            }
                        }
                    },
                    post: {
                        tags: [schema.model],
                        summary: `Create a new ${schema.model}`,
                        operationId: `post${schema.model}`,
                        parameters: [],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": `#/components/schemas/${ucname}PostRequest`
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: `A list of ${schema.model}`,
                                content: {
                                    "application/json": {
                                        schema: {
                                            "$ref": `#/components/schemas/${ucname}PostResponse`
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                [`/api/${schema.model}/{_id}`]: {
                    get: {
                        tags: [schema.model],
                        summary: `Get a ${schema.model} by ID`,
                        operationId: `get${schema.model}ById`,
                        parameters: [
                            {
                                $ref: "#/components/parameters/_id"
                            }
                        ],
                        responses: {
                            200: {
                                description: `A ${schema.model}`,
                                content: {
                                    "application/json": {
                                        schema: {
                                            "$ref": `#/components/schemas/${ucname}`
                                        }
                                    }
                                }
                            }
                        }
                    },
                    put: {
                        tags: [schema.model],
                        summary: `Update a ${schema.model} by ID`,
                        operationId: `put${schema.model}ById`,
                        parameters: [
                            {
                                $ref: "#/components/parameters/_id"
                            }
                        ],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        "$ref": `#/components/schemas/${ucname}PostRequest`
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: `A ${schema.model}`,
                                content: {
                                    "application/json": {
                                        schema: {
                                            "$ref": `#/components/schemas/${ucname}PostResponse`
                                        }
                                    }
                                }
                            }
                        }
                    },
                    delete: {
                        tags: [schema.model],
                        summary: `Delete a ${schema.model} by ID`,
                        operationId: `delete${schema.model}ById`,
                        parameters: [
                            {
                                $ref: "#/components/parameters/_id"
                            }
                        ],
                        responses: {
                            200: {
                                description: `A ${schema.model}`,
                                content: {
                                    "application/json": {
                                        schema: {
                                            "$ref": `#/components/schemas/${ucname}DeleteResponse`
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            spec.paths = Object.assign(spec.paths, paths);

            
            spec.components.schemas[ucname] = {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                        description: "MongoDB Object ID",
                        index: true,
                        required: true,
                        unique: true
                    }
                }
            };
            for (let prop_name in schema.properties) {
                const prop = schema.properties[prop_name];
                const type = type_map(schema.paths[prop_name].instance);
                if (ucname === "Usergroups") console.log({prop_name, type: schema.paths[prop_name].instance });
                spec.components.schemas[ucname].properties[prop_name] = {
                    type,
                    default: prop.default,
                    description: prop.description,
                    index: prop.index,
                    required: prop.required,
                    unique: prop.unique,
                    min: prop.min,
                    max: prop.max,
                };
                if (prop.link) {
                    spec.components.schemas[ucname].properties[prop_name].$ref = `#/components/schemas/${prop.link}`;
                }
                if (prop.type === "array") {
                    spec.components.schemas[ucname].properties[prop_name].items = {
                        type: prop.items.type,
                        default: prop.items.default,
                        array: true
                    };
                }
            }
            spec.components.schemas = Object.assign(spec.components.schemas, this.postRequestSchemaComponent(schema));
            spec.components.schemas = Object.assign(spec.components.schemas, this.postResponseSchemaComponent(schema));
            spec.components.schemas = Object.assign(spec.components.schemas, this.responseSchemaComponent(schema.model));
            spec.components.schemas = Object.assign(spec.components.schemas, this.deleteResponseSchemaComponent(schema));
        }
        return spec;
    }
}

module.exports = OpenAPI;