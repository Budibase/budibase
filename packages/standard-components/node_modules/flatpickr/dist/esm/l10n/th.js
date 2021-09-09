const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Thai = {
    weekdays: {
        shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
        longhand: [
            "อาทิตย์",
            "จันทร์",
            "อังคาร",
            "พุธ",
            "พฤหัสบดี",
            "ศุกร์",
            "เสาร์",
        ],
    },
    months: {
        shorthand: [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค.",
        ],
        longhand: [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
        ],
    },
    firstDayOfWeek: 1,
    rangeSeparator: " ถึง ",
    scrollTitle: "เลื่อนเพื่อเพิ่มหรือลด",
    toggleTitle: "คลิกเพื่อเปลี่ยน",
    time_24hr: true,
    ordinal: () => {
        return "";
    },
};
fp.l10ns.th = Thai;
export default fp.l10ns;
