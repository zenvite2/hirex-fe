export function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function convertNumberToLocaleString(
    number: number,
    locale: string = "en-US",
    options?: Intl.NumberFormatOptions
): string {
    return number.toLocaleString(locale, options);
}

export function formatNumberToVietnameseShort(number: number): string {
    if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(1).replace(/\.0$/, '')} tr`; // 1.0tr -> 1tr
    }
    if (number >= 1_000) {
        return `${(number / 1_000).toFixed(1).replace(/\.0$/, '')} k`; // 1.0k -> 1k
    }
    else {
        return `${(number).toFixed(1).replace(/\.0$/, '')} đ`; // 1 -> 1đ
    }
    return number.toString();
}

export const denormalizeTextAreaContent = (content: string): string => {
    if (!content) return '';
    return content.replace(/\\n/g, '<br />').replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
};