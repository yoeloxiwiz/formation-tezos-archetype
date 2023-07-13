import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
const pay_arg_to_mich = (beneficiary: att.Address): att.Micheline => {
    return beneficiary.to_mich();
}
export class Payment_with_fees {
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
    async deploy(owner: att.Address, params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/payment_with_fees.arl", {
            owner: owner.to_mich()
        }, params)).address;
        this.address = address;
    }
    async pay(beneficiary: att.Address, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "pay", pay_arg_to_mich(beneficiary), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_pay_param(beneficiary: att.Address, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "pay", pay_arg_to_mich(beneficiary), params);
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
    async get_fee(): Promise<att.Rational> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.Rational.from_mich(att.pair_to_mich((storage as att.Mpair as att.Mpair).args.slice(1, 3)));
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        r0: att.string_to_mich("\"REQUIRE_MIN_AMOUNT\"")
    };
}
export const payment_with_fees = new Payment_with_fees();
