import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const payback_after_period_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class Time_window {
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
    async deploy(creation_date: Date, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/tutorials/time_window.arl", {
            creation_date: att.date_to_mich(creation_date)
        }, params)).address;
        this.address = address;
    }
    async payback_after_period(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "payback_after_period", payback_after_period_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_payback_after_period_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "payback_after_period", payback_after_period_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_creation(): Promise<Date> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_date(storage);
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r1: att.pair_to_mich([att.string_to_mich("\"INVALID_CONDITION\""), att.string_to_mich("\"r1\"")])
    };
}
export const time_window = new Time_window();
