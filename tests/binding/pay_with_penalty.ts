import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const pay_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class Pay_with_penalty {
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
    async deploy(holder: att.Address, cost: att.Tez, deadline: Date, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/pay_with_penalty.arl", {
            holder: holder.to_mich(),
            cost: cost.to_mich(),
            deadline: att.date_to_mich(deadline)
        }, params)).address;
        this.address = address;
    }
    async pay(params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "pay", pay_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_pay_param(params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "pay", pay_arg_to_mich(), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_holder(): Promise<att.Address> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Address.from_mich((storage as att.Mpair).args[0]);
        }
        throw new Error("Contract not initialised");
    }
    async get_cost(): Promise<att.Tez> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Tez.from_mich((storage as att.Mpair).args[1]);
        }
        throw new Error("Contract not initialised");
    }
    async get_deadline(): Promise<Date> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_date((storage as att.Mpair).args[2]);
        }
        throw new Error("Contract not initialised");
    }
    errors = {};
}
export const pay_with_penalty = new Pay_with_penalty();
