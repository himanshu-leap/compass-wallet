import { custom } from "wagmi";

const RPC_ENDPOINT = "https://evm-rpc-arctic-1.sei-apis.com";

async function sendRpcRequest(method: string, params: any) {
    try {
        const response = await fetch(RPC_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method,
                params,
                id: 713715,
            }),
        });

        return await response.json();
    } catch (error) {
        throw new Error(error as string);
    }
}

const customRpc = {
    async request(method: string, params: any) {
        try {
            const response = await sendRpcRequest(method, params);
            return response.result;
        } catch (error) {
            throw new Error(error as string);
        }
    },
};

const customSeiTransport = custom({
    async request({ method, params }) {
        return await customRpc.request(method, params);
    },
});

export { customRpc, customSeiTransport };
