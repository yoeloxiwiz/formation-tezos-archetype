import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export enum states {
    Created = 1,
    InProgress,
    Interrupted,
    Completed
}
export const mich_to_state = (m: any): states => {
    const v = (new att.Nat((m as att.Mint).int)).to_big_number().toNumber();
    switch (v) {
        case 0: return states.Created;
        case 1: return states.InProgress;
        case 2: return states.Interrupted;
        case 3: return states.Completed;
        default: throw new Error("mich_to_asset_type : invalid value " + v);
    }
};
const inc_value_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const init_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const complete_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
const interrupt_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class State_machine {
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
        const address = (await ex.deploy("./contracts/tutorials/state_machine.arl", {}, params)).address;
        this.address = address;
    }
    async inc_value(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "inc_value", inc_value_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async init(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "init", init_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async complete(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "complete", complete_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async interrupt(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "interrupt", interrupt_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_inc_value_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "inc_value", inc_value_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_init_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "init", init_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_complete_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "complete", complete_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_interrupt_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "interrupt", interrupt_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_value(): Promise<att.Nat> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Nat.from_mich((storage as att.Mpair).args[1]);
        }
        throw new Error("Contract not initialised");
    }
    async get_state(): Promise<states> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const state = (storage as att.Mpair).args[0];
            switch (att.Int.from_mich(state).to_number()) {
                case 0: return states.Created;
                case 1: return states.InProgress;
                case 2: return states.Interrupted;
                case 3: return states.Completed;
            }
        }
        return states.Created;
    }
    errors = {
        INVALID_STATE: att.string_to_mich("\"INVALID_STATE\"")
    };
}
export const state_machine = new State_machine();
