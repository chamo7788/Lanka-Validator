export type NICType = 'Old' | 'New';
export type NICGender = 'Male' | 'Female';
export interface NICDecodeResult {
    isValid: boolean;
    type: NICType;
    gender: NICGender;
    birthday: Date;
    isVoter?: boolean;
}
export declare class NIC {
    private static readonly OLD_NIC_REGEX;
    private static readonly NEW_NIC_REGEX;
    static decode(nicString: string): NICDecodeResult;
    private static isLeapYear;
    private static dateFromDayOfYear;
}
