const fp = typeof window !== "undefined" && window.flatpickr !== undefined
    ? window.flatpickr
    : {
        l10ns: {},
    };
export const Khmer = {
    weekdays: {
        shorthand: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស.", "សុក្រ", "សៅរ៍"],
        longhand: [
            "អាទិត្យ",
            "ចន្ទ",
            "អង្គារ",
            "ពុធ",
            "ព្រហស្បតិ៍",
            "សុក្រ",
            "សៅរ៍",
        ],
    },
    months: {
        shorthand: [
            "មករា",
            "កុម្ភះ",
            "មីនា",
            "មេសា",
            "ឧសភា",
            "មិថុនា",
            "កក្កដា",
            "សីហា",
            "កញ្ញា",
            "តុលា",
            "វិច្ឆិកា",
            "ធ្នូ",
        ],
        longhand: [
            "មករា",
            "កុម្ភះ",
            "មីនា",
            "មេសា",
            "ឧសភា",
            "មិថុនា",
            "កក្កដា",
            "សីហា",
            "កញ្ញា",
            "តុលា",
            "វិច្ឆិកា",
            "ធ្នូ",
        ],
    },
    ordinal: () => {
        return "";
    },
    firstDayOfWeek: 1,
    rangeSeparator: " ដល់ ",
    weekAbbreviation: "សប្តាហ៍",
    scrollTitle: "រំកិលដើម្បីបង្កើន",
    toggleTitle: "ចុចដើម្បីផ្លាស់ប្ដូរ",
    yearAriaLabel: "ឆ្នាំ",
    time_24hr: true,
};
fp.l10ns.km = Khmer;
export default fp.l10ns;
