import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export const votes_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("string", []);
export const votes_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export type votes_container = Array<[
    string,
    att.Nat
]>;
export const votes_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("string", []), att.prim_annot_to_mich_type("nat", []), []);
const set_expiration_date_arg_to_mich = (new_expiration_date: Date): att.Micheline => {
    return att.date_to_mich(new_expiration_date);
}
const vote_arg_to_mich = (choice_value: string): att.Micheline => {
    return att.string_to_mich(choice_value);
}
const view_result_arg_to_mich = (): att.Micheline => {
    return att.unit_mich;
}
export class Poll {
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
    async deploy(owner: att.Address, expiration_date: Date, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/poll.arl", {
            owner: owner.to_mich(),
            expiration_date: att.date_to_mich(expiration_date)
        }, params)).address;
        this.address = address;
    }
    async set_expiration_date(new_expiration_date: Date, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "set_expiration_date", set_expiration_date_arg_to_mich(new_expiration_date), params);
        }
        throw new Error("Contract not initialised");
    }
    async vote(choice_value: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "vote", vote_arg_to_mich(choice_value), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_set_expiration_date_param(new_expiration_date: Date, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "set_expiration_date", set_expiration_date_arg_to_mich(new_expiration_date), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_vote_param(choice_value: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "vote", vote_arg_to_mich(choice_value), params);
        }
        throw new Error("Contract not initialised");
    }
    async view_result(params: Partial<ex.Parameters>): Promise<[
        string,
        att.Nat
    ] | undefined> {
        if (this.address != undefined) {
            const mich = await ex.exec_view(this.get_address(), "result", view_result_arg_to_mich(), params);
            return mich.value ? (p => {
                return [att.mich_to_string((p as att.Mpair).args[0]), att.Nat.from_mich((p as att.Mpair).args[1])];
            })(mich.value) : undefined;
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
    async get_expiration_date(): Promise<Date> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_date((storage as att.Mpair).args[1]);
        }
        throw new Error("Contract not initialised");
    }
    async get_question(): Promise<string> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_string((storage as att.Mpair).args[2]);
        }
        throw new Error("Contract not initialised");
    }
    async get_choices(): Promise<Array<string>> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_list((storage as att.Mpair).args[3], x => { return att.mich_to_string(x); });
        }
        throw new Error("Contract not initialised");
    }
    async get_votes(): Promise<votes_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map((storage as att.Mpair).args[4], (x, y) => [att.mich_to_string(x), att.Nat.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    async get_voters(): Promise<Array<att.Address>> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_list((storage as att.Mpair).args[5], x => { return att.Address.from_mich(x); });
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r2: att.string_to_mich("\"ADDRESS_HAS_ALREADY_VOTED\""),
        r1: att.string_to_mich("\"CHOICE_NOT_IN_LIST\""),
        r0: att.string_to_mich("\"POLL_HAS_EXPIRED\""),
        INVALID_CALLER: att.string_to_mich("\"INVALID_CALLER\"")
    };
}
export const poll = new Poll();
