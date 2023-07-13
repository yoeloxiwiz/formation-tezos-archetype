import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const deposit_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const release_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class Escrow {
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
    async deploy(owner: att.Address, beneficiary: att.Address, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/escrow.arl", {
            owner: owner.to_mich(),
            beneficiary: beneficiary.to_mich()
        }, params)).address;
        this.address = address;
    }
    async deposit(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "deposit", deposit_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async release(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "release", release_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_deposit_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "deposit", deposit_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_release_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "release", release_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_owner(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[0]);
        }
        throw new Error("Contract not initialised");
    }
    async get_beneficiary(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[1]);
        }
        throw new Error("Contract not initialised");
    }
    async get_amount(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[2]);
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\""),
        r0: att.string_to_mich("\"REQUIRE_MIN_AMOUNT\"")
    };
}
export const escrow = new Escrow();
