import { environment } from 'src/environments/environment';
export class MsgParam {
    constructor(){}
    getMsgParam(nonce: string): any {
        const msgParams = {
            domain: {
                chainId: environment.chainId,
                name: 'Qatar Prode 2022',
                verifyingContract: '0x8DD130Cd016d322555f96C10861ed4d79A916337',
                version: '1',
            },
            message: {
                Firma: `Por Favor Firma Digitalmente para iniciar Sesion en Qatar Prode 2022, nonce:${nonce}`

            },
            primaryType: 'Prode',
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                Prode: [
                    { name: 'Firma', type: 'string' },
                ]
            },
        };

        return msgParams;
    }
}
