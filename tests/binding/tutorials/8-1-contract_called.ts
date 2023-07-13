import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const set_n_arg_to_mich = (p: att.Nat): att.Micheline => {
    return p.to_mich();
}
export class Contract_called {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/tutorials/contract_called.arl", {}, params)).address;
        this.address = address;
    }
    async set_n(p: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_n", set_n_arg_to_mich(p), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_n_param(p: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_n", set_n_arg_to_mich(p), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_n(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Nat.from_mich(storage);
        }
        throw new Error("Contract not initialised");
    }
    errors = {};
}
export const contract_called = new Contract_called();
