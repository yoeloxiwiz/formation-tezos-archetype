import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const main_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class Hello {
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
        const address = (await ex.deploy("./contracts/tutorials/hello.arl", {}, params)).address;
        this.address = address;
    }
    async main(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "main", main_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_main_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "main", main_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_str(): Promise<string> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_string(storage);
        }
        throw new Error("Contract not initialised");
    }
    errors = {};
}
export const hello = new Hello();
