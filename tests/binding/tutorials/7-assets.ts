import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export enum Color_types {
    White = "White",
    Yellow = "Yellow",
    Red = "Red",
    Blue = "Blue"
}
export abstract class Color extends att.Enum<Color_types> {
    abstract to_mich(): att.Micheline;
    equals(v: Color): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
}
export class White extends Color {
    constructor() {
        super(Color_types.White);
    }
    to_mich() { return new att.Int(0).to_mich(); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export class Yellow extends Color {
    constructor() {
        super(Color_types.Yellow);
    }
    to_mich() { return new att.Int(1).to_mich(); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export class Red extends Color {
    constructor() {
        super(Color_types.Red);
    }
    to_mich() { return new att.Int(2).to_mich(); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export class Blue extends Color {
    constructor() {
        super(Color_types.Blue);
    }
    to_mich() { return new att.Int(3).to_mich(); }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}
export const mich_to_Color = (m: any): Color => {
    const v = (new att.Nat((m as att.Mint).int)).to_big_number().toNumber();
    switch (v) {
        case 0: return new White();
        case 1: return new Yellow();
        case 2: return new Red();
        case 3: return new Blue();
        default: throw new Error("mich_to_asset_type : invalid value " + v);
    }
};
export const vehicle_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("string", []);
export class vehicle_value implements att.ArchetypeType {
    constructor(public color: Color, public nbrepairs: att.Nat, public lastrepair: Date) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([this.color.to_mich(), this.nbrepairs.to_mich(), att.date_to_mich(this.lastrepair)]);
    }
    equals(v: vehicle_value): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): vehicle_value {
        return new vehicle_value(mich_to_Color((input as att.Mpair).args[0]), att.Nat.from_mich((input as att.Mpair).args[1]), att.mich_to_date((input as att.Mpair).args[2]));
    }
}
export const vehicle_value_mich_type: att.MichelineType = att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("int", ["%color"]),
    att.prim_annot_to_mich_type("nat", ["%nbrepairs"]),
    att.prim_annot_to_mich_type("timestamp", ["%lastrepair"])
], []);
export type vehicle_container = Array<[
    string,
    vehicle_value
]>;
export const vehicle_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("map", att.prim_annot_to_mich_type("string", []), att.pair_array_to_mich_type([
    att.prim_annot_to_mich_type("int", ["%color"]),
    att.prim_annot_to_mich_type("nat", ["%nbrepairs"]),
    att.prim_annot_to_mich_type("timestamp", ["%lastrepair"])
], []), []);
const add_vehicle_arg_to_mich = (pvin: string): att.Micheline => {
    return att.string_to_mich(pvin);
}
const repair_arg_to_mich = (k: string): att.Micheline => {
    return att.string_to_mich(k);
}
const repaint_repaired_arg_to_mich = (newc: Color): att.Micheline => {
    return newc.to_mich();
}
export class Assets {
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
        const address = (await ex.deploy("./contracts/tutorials/assets.arl", {}, params)).address;
        this.address = address;
    }
    async add_vehicle(pvin: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "add_vehicle", add_vehicle_arg_to_mich(pvin), params);
        }
        throw new Error("Contract not initialised");
    }
    async repair(k: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "repair", repair_arg_to_mich(k), params);
        }
        throw new Error("Contract not initialised");
    }
    async repaint_repaired(newc: Color, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "repaint_repaired", repaint_repaired_arg_to_mich(newc), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_add_vehicle_param(pvin: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "add_vehicle", add_vehicle_arg_to_mich(pvin), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_repair_param(k: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "repair", repair_arg_to_mich(k), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_repaint_repaired_param(newc: Color, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "repaint_repaired", repaint_repaired_arg_to_mich(newc), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_vehicle(): Promise<vehicle_container> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            return att.mich_to_map(storage, (x, y) => [att.mich_to_string(x), vehicle_value.from_mich(y)]);
        }
        throw new Error("Contract not initialised");
    }
    errors = {};
}
export const assets = new Assets();
