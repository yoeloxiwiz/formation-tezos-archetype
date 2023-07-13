import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const set_admin_arg_to_mich = (addr: att.Address): att.Micheline => {
    return addr.to_mich();
}
const main_arg_to_mich = (v: att.Nat): att.Micheline => {
    return v.to_mich();
}
export class Exec_condition {
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
        const address = (await ex.deploy("./contracts/tutorials/exec_condition.arl", {}, params)).address;
        this.address = address;
    }
    async set_admin(addr: att.Address, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_admin", set_admin_arg_to_mich(addr), params);
        }
        throw new Error("Contract not initialised");
    }
    async main(v: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "main", main_arg_to_mich(v), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_admin_param(addr: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_admin", set_admin_arg_to_mich(addr), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_main_param(v: att.Nat, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "main", main_arg_to_mich(v), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_value(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Nat.from_mich((storage as att.Mpair).args[0]);
        }
        throw new Error("Contract not initialised");
    }
    async get_admin(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[1]);
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r2: att.string_to_mich("\"EXPECTED EVEN VALUE\""),
        r1: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"r1\"")]),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\"")
    };
}
export const exec_condition = new Exec_condition();
