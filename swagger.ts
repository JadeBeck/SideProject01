import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: "SideProject01-APIs",
        description: "Description",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "회원가입 및 로그인 API",
            description: ""
        },
        {
            name: "회원정보 관련 API",
            description: ""
        },
        {
            name: "게시물 API",
            description: ""
        },
        {
            name: "채팅 API",
            description: ""
        }
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: "apiKey",
            in: "header", // can be "header", "query" or "cookie"
            name: "Authorization", // name of the header, query parameter or cookie
            description: "any description...",
        },
    },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);